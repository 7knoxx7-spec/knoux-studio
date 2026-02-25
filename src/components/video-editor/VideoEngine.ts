export interface VideoClip {
  id: string;
  type: 'video' | 'audio' | 'image' | 'text';
  name: string;
  src: string;
  startTime: number;
  duration: number;
  trimmedDuration: number;
  track: number;
  volume?: number;
  speed?: number;
  filters?: VideoFilter[];
  effects?: VideoEffect[];
  transform?: {
    scale?: number;
    rotation?: number;
    position?: { x: number; y: number };
    opacity?: number;
  };
  text?: {
    content: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor?: string;
    position: 'center' | 'top' | 'bottom' | 'custom';
  };
}

export interface VideoTrack {
  id: string;
  index: number;
  name: string;
  type: 'video' | 'audio' | 'text' | 'overlay';
  clips: VideoClip[];
  muted?: boolean;
  locked?: boolean;
  volume?: number;
}

export interface VideoEffect {
  id: string;
  type: 'blur' | 'sharpen' | 'glitch' | 'vintage' | 'cinematic' | 'chroma';
  intensity: number;
  startTime: number;
  endTime: number;
  params?: Record<string, unknown>;
}

export interface VideoFilter {
  id: string;
  type: string;
  intensity: number;
}

export interface TimelineState {
  duration: number;
  currentTime: number;
  zoom: number;
  tracks: VideoTrack[];
  selectedClipId: string | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
}

export interface ExportOptions {
  format?: 'mp4' | 'mov' | 'webm';
  resolution?: '480p' | '720p' | '1080p' | '4k';
  quality?: 'low' | 'medium' | 'high';
  filename?: string;
}

type Listener = (data?: unknown) => void;

export class VideoEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private state: TimelineState = {
    duration: 0,
    currentTime: 0,
    zoom: 1,
    tracks: [],
    selectedClipId: null,
    isPlaying: false,
    volume: 1,
    muted: false,
    playbackRate: 1,
  };
  private listeners: Map<string, Listener[]> = new Map();
  private animationFrame: number | null = null;
  private videoElements: Map<string, HTMLVideoElement> = new Map();

  attachCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    this.renderStill();
  }

  getState() {
    return this.state;
  }

  on(event: string, callback: Listener) {
    const list = this.listeners.get(event) || [];
    list.push(callback);
    this.listeners.set(event, list);
  }

  private emit(event: string, data?: unknown) {
    (this.listeners.get(event) || []).forEach((cb) => cb(data));
  }

  private setState(newState: Partial<TimelineState>) {
    this.state = { ...this.state, ...newState };
    this.emit('stateChange', this.state);
  }

  async loadVideo(file: File): Promise<VideoClip> {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));

    const clip: VideoClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'video',
      name: file.name,
      src: url,
      startTime: 0,
      duration: video.duration,
      trimmedDuration: video.duration,
      track: 0,
      volume: 1,
      speed: 1,
      transform: { scale: 1, rotation: 0, position: { x: 0, y: 0 }, opacity: 1 },
    };

    this.videoElements.set(clip.id, video);
    this.addClip(clip);
    return clip;
  }

  async loadImage(file: File, duration = 5): Promise<VideoClip> {
    const clip: VideoClip = {
      id: `image-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'image',
      name: file.name,
      src: URL.createObjectURL(file),
      startTime: 0,
      duration,
      trimmedDuration: duration,
      track: 0,
      transform: { scale: 1, rotation: 0, position: { x: 0, y: 0 }, opacity: 1 },
    };
    this.addClip(clip);
    return clip;
  }

  async loadAudio(file: File): Promise<VideoClip> {
    const duration = 5;
    const clip: VideoClip = {
      id: `audio-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'audio',
      name: file.name,
      src: URL.createObjectURL(file),
      startTime: 0,
      duration,
      trimmedDuration: duration,
      track: 1,
      volume: 1,
    };
    this.addClip(clip);
    return clip;
  }

  addText(text: string, duration = 5): VideoClip {
    const clip: VideoClip = {
      id: `text-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'text',
      name: 'نص',
      src: '',
      startTime: this.state.currentTime,
      duration,
      trimmedDuration: duration,
      track: 2,
      text: { content: text, fontFamily: 'Arial', fontSize: 48, color: '#ffffff', position: 'center' },
    };
    this.addClip(clip);
    return clip;
  }

  private addClip(clip: VideoClip) {
    const tracks = [...this.state.tracks];
    let track = tracks.find((t) => t.index === clip.track);
    if (!track) {
      track = {
        id: `track-${clip.track}`,
        index: clip.track,
        name: clip.type === 'video' ? 'فيديو' : clip.type === 'audio' ? 'صوت' : clip.type === 'text' ? 'نصوص' : 'صور',
        type: clip.type === 'video' ? 'video' : clip.type === 'audio' ? 'audio' : clip.type === 'text' ? 'text' : 'overlay',
        clips: [],
      };
      tracks.push(track);
      tracks.sort((a, b) => a.index - b.index);
    }
    track.clips.push(clip);
    this.setState({ tracks });
    this.updateDuration();
    this.emit('clipAdded', clip);
  }

  private updateDuration() {
    let maxDuration = 0;
    this.state.tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        const end = clip.startTime + clip.trimmedDuration;
        if (end > maxDuration) maxDuration = end;
      });
    });
    this.setState({ duration: maxDuration });
  }

  togglePlay() {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  play() {
    this.setState({ isPlaying: true });
    this.renderFrame();
    this.emit('play');
  }

  pause() {
    this.setState({ isPlaying: false });
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.emit('pause');
  }

  seek(time: number) {
    this.setState({ currentTime: Math.max(0, Math.min(time, this.state.duration)) });
    this.renderStill();
    this.emit('seek', this.state.currentTime);
  }

  setVolume(volume: number) {
    this.setState({ volume: Math.max(0, Math.min(1, volume)) });
    this.emit('volumeChange', this.state.volume);
  }

  toggleMute() {
    this.setState({ muted: !this.state.muted });
    this.emit('muteChange', this.state.muted);
  }

  setPlaybackRate(rate: number) {
    this.setState({ playbackRate: rate });
    this.emit('rateChange', rate);
  }

  trimClip(clipId: string, start: number, end: number) {
    const tracks = this.state.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) => (clip.id === clipId ? { ...clip, startTime: start, trimmedDuration: end - start } : clip)),
    }));
    this.setState({ tracks });
    this.updateDuration();
  }

  splitClip(clipId: string, time: number) {
    const tracks = [...this.state.tracks];
    for (const track of tracks) {
      const index = track.clips.findIndex((c) => c.id === clipId);
      if (index !== -1) {
        const clip = track.clips[index];
        const clip1: VideoClip = { ...clip, id: `${clip.id}-part1`, trimmedDuration: time - clip.startTime };
        const clip2: VideoClip = { ...clip, id: `${clip.id}-part2`, startTime: time, trimmedDuration: clip.startTime + clip.trimmedDuration - time };
        track.clips.splice(index, 1, clip1, clip2);
        break;
      }
    }
    this.setState({ tracks });
  }

  deleteClip(clipId: string) {
    const tracks = this.state.tracks
      .map((track) => ({ ...track, clips: track.clips.filter((c) => c.id !== clipId) }))
      .filter((track) => track.clips.length > 0);
    this.setState({ tracks });
    this.updateDuration();
  }

  setClipSpeed(clipId: string, speed: number) {
    const tracks = this.state.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) => (clip.id === clipId ? { ...clip, speed, trimmedDuration: clip.duration / speed } : clip)),
    }));
    this.setState({ tracks });
    this.updateDuration();
  }

  addEffect(clipId: string, effect: Omit<VideoEffect, 'id'>) {
    const tracks = this.state.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) =>
        clip.id === clipId ? { ...clip, effects: [...(clip.effects || []), { ...effect, id: `effect-${Date.now()}` }] } : clip
      ),
    }));
    this.setState({ tracks });
  }

  private renderStill() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '28px sans-serif';
    this.ctx.fillText(`Time: ${this.state.currentTime.toFixed(2)}s`, 40, 60);
  }

  private renderFrame = async () => {
    if (!this.ctx || !this.canvas) return;
    this.renderStill();

    if (this.state.isPlaying) {
      const next = this.state.currentTime + (1 / 30) * this.state.playbackRate;
      if (next >= this.state.duration) {
        this.pause();
        this.setState({ currentTime: 0 });
      } else {
        this.setState({ currentTime: next });
        this.animationFrame = requestAnimationFrame(this.renderFrame);
      }
    }
  };

  async exportVideo(options: ExportOptions): Promise<string> {
    this.emit('exportStart', options);
    const blob = new Blob([], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    this.emit('exportComplete', { url, blob });
    return url;
  }

  dispose() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.videoElements.forEach((video) => {
      video.pause();
      video.src = '';
    });
    this.videoElements.clear();
  }
}

export default VideoEngine;
