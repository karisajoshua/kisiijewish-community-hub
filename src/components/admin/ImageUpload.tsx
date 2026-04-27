import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export const ImageUpload = ({ value, onChange, folder = "uploads" }: Props) => {
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("community-images").upload(path, file);
    if (error) { toast.error(error.message); setBusy(false); return; }
    const { data } = supabase.storage.from("community-images").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-24 w-24 object-cover rounded border border-border" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <label className="inline-flex items-center gap-2 text-sm bg-secondary text-secondary-foreground px-3 py-2 rounded cursor-pointer hover:opacity-90">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
        <Input placeholder="or paste URL" value={value || ""} onChange={(e) => onChange(e.target.value)} className="flex-1" />
      </div>
    </div>
  );
};
