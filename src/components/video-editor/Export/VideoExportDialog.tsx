'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, Facebook, Film, Instagram, Loader2, Twitter, Video, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type VideoEngine from '../VideoEngine';

interface ExportPreset { id: string; name: string; platform: string; resolution: string; bitrate: string; format: string; fps: number; icon: React.ElementType }

interface VideoExportDialogProps { open: boolean; onOpenChange: (open: boolean) => void; engine: VideoEngine | null; strings: Record<string, string> }

const presets: ExportPreset[] = [
  { id: 'youtube-1080p', name: 'YouTube 1080p', platform: 'youtube', resolution: '1920x1080', bitrate: '16', format: 'mp4', fps: 30, icon: Youtube },
  { id: 'instagram-reel', name: 'Instagram Reel', platform: 'instagram', resolution: '1080x1920', bitrate: '15', format: 'mp4', fps: 30, icon: Instagram },
  { id: 'facebook-feed', name: 'Facebook Feed', platform: 'facebook', resolution: '1280x720', bitrate: '8', format: 'mp4', fps: 30, icon: Facebook },
  { id: 'twitter-card', name: 'Twitter Card', platform: 'twitter', resolution: '1280x720', bitrate: '6', format: 'mp4', fps: 30, icon: Twitter },
  { id: 'h264-master', name: 'H.264 Master', platform: 'professional', resolution: '1920x1080', bitrate: '50', format: 'mp4', fps: 30, icon: Video },
  { id: 'prores-422', name: 'ProRes 422', platform: 'professional', resolution: '1920x1080', bitrate: '147', format: 'mov', fps: 30, icon: Film },
];

export function VideoExportDialog({ open, onOpenChange, engine }: VideoExportDialogProps) {
  const [activeTab, setActiveTab] = useState('presets');
  const [selectedPreset, setSelectedPreset] = useState('youtube-1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState('video');
  const [bitrate, setBitrate] = useState(16);

  const handleExport = async () => {
    setIsExporting(true);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      setProgress(i);
    }
    setIsExporting(false);
    onOpenChange(false);
  };

  const estimateFileSize = () => {
    const preset = presets.find((p) => p.id === selectedPreset);
    if (!preset || !engine) return '0 MB';
    const duration = (engine as unknown as { state?: { duration?: number } }).state?.duration ?? 60;
    return `${((parseInt(preset.bitrate, 10) * 1000 * duration) / (8 * 1024)).toFixed(0)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] max-w-2xl flex-col overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'><Download className='h-5 w-5 text-[#D4AF37]' />تصدير الفيديو</DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-auto'>
          {isExporting ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='py-8 text-center'>
              <Loader2 className='mx-auto mb-3 h-8 w-8 animate-spin text-[#D4AF37]' />
              <Progress value={progress} className='mx-auto h-2 max-w-xs' />
              <p className='mt-2 text-xs text-muted-foreground'>{progress}%</p>
            </motion.div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='presets'>إعدادات مسبقة</TabsTrigger>
                <TabsTrigger value='custom'>مخصص</TabsTrigger>
              </TabsList>

              <TabsContent value='presets' className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <Label>اسم الملف</Label>
                  <Input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder='video' />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  {presets.map((preset) => <PresetCard key={preset.id} preset={preset} selected={selectedPreset === preset.id} onSelect={() => setSelectedPreset(preset.id)} />)}
                </div>
              </TabsContent>

              <TabsContent value='custom' className='mt-4 space-y-3'>
                <div className='space-y-2'>
                  <Label>Bitrate (Mbps)</Label>
                  <div className='flex items-center justify-between text-sm'><span>الجودة</span><span className='font-mono'>{bitrate}</span></div>
                  <Slider value={[bitrate]} min={1} max={100} step={1} onValueChange={(v) => setBitrate(v[0])} />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter className='mt-4 border-t pt-4'>
          <div className='flex w-full items-center justify-between'>
            {!isExporting && <p className='text-xs text-muted-foreground'>الحجم التقريبي: <span className='font-medium'>{estimateFileSize()}</span></p>}
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isExporting}>إلغاء</Button>
              <Button onClick={handleExport} disabled={isExporting} className='bg-[#D4AF37] text-[#2c1810] hover:bg-[#FDB931]'>
                {isExporting ? <Loader2 className='me-2 h-4 w-4 animate-spin' /> : <Download className='me-2 h-4 w-4' />}تصدير
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PresetCard({ preset, selected, onSelect }: { preset: ExportPreset; selected: boolean; onSelect: () => void }) {
  const Icon = preset.icon;
  return (
    <Card className={cn('cursor-pointer transition-all', selected ? 'ring-2 ring-[#D4AF37] bg-[#D4AF37]/5' : 'hover:bg-muted/50')} onClick={onSelect}>
      <CardContent className='p-3'>
        <div className='flex items-center gap-3'>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', selected ? 'bg-[#D4AF37] text-[#2c1810]' : 'bg-muted')}><Icon className='h-4 w-4' /></div>
          <div className='min-w-0 flex-1'><p className='truncate text-sm font-medium'>{preset.name}</p><p className='text-xs text-muted-foreground'>{preset.resolution} · {preset.bitrate} Mbps</p></div>
          {selected && <Check className='h-4 w-4 text-[#D4AF37]' />}
        </div>
      </CardContent>
    </Card>
  );
}

export default VideoExportDialog;
