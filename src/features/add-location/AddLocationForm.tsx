"use client";

import { useAddLocationStore } from "@/store/useAddLocationStore";
import { useLocationStore } from "@/store/useLocationStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import MapPickerDynamic from "./MapPickerDynamic";
import { Category, Location } from "@/constants/mock-data";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";

export default function AddLocationForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const { name, updateField, address, category, description, imageUrl, lat, lng, editingId, reset } = useAddLocationStore();
  const { addLocation, updateLocation } = useLocationStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!name || category === 'All' || !address || !description) {
      alert("Please fill out all required fields!");
      return;
    }

    if (editingId) {
      updateLocation(editingId, {
        name,
        category: category as Category,
        address,
        description,
        lat,
        lng,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1629809819614-72a3928a3070?q=80&w=1000&auto=format&fit=crop',
      });
    } else {
      const newSpot: Location = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        category: category as Category,
        address,
        description,
        lat,
        lng,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1629809819614-72a3928a3070?q=80&w=1000&auto=format&fit=crop',
        rating: 5.0, // default rating for new spot
        reviewsCount: 'New',
        distance: 'Just added',
      };
      addLocation(newSpot);
    }

    reset(); // reset form state
    router.push("/"); // navigate to map view
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 sm:p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 max-w-3xl mx-auto md:ml-0 transition-colors">
      
      {/* 1. Location Identity */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] dark:bg-[#0077b6]/20 text-[#0077b6] dark:text-[#38bdf8] flex items-center justify-center font-bold">1</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 transition-colors">{t.addLocationForm.locationIdentity}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase transition-colors">{t.addLocationForm.locationName}</label>
            <Input 
              placeholder={t.addLocationForm.locationNamePlaceholder}
              className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 h-11 text-slate-800 dark:text-slate-100 transition-colors"
              value={name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase transition-colors">{t.addLocationForm.category}</label>
            <Select value={category} onValueChange={(val) => updateField('category', val as Category)}>
              <SelectTrigger className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 h-11 text-slate-800 dark:text-slate-100 transition-colors">
                <SelectValue placeholder={t.addLocationForm.categoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beaches">Beaches</SelectItem>
                <SelectItem value="Dining">Dining</SelectItem>
                <SelectItem value="Stay">Stay</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase transition-colors">{t.addLocationForm.streetAddress}</label>
          <div className="relative">
            <Input 
              placeholder={t.addLocationForm.streetAddressPlaceholder}
              className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 pl-10 h-11 text-slate-800 dark:text-slate-100 transition-colors"
              value={address}
              onChange={(e) => updateField('address', e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-400 dark:border-slate-500 bg-transparent flex items-center justify-center transition-colors">
               <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full transition-colors"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Story */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] dark:bg-[#0077b6]/20 text-[#0077b6] dark:text-[#38bdf8] flex items-center justify-center font-bold">2</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 transition-colors">{t.addLocationForm.visualStory}</h2>
        </div>
        
        <label
          className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${
            imageUrl ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload} 
          />
          {imageUrl ? (
             <div className="flex flex-col items-center">
               <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
               <p className="font-bold text-slate-800 dark:text-slate-200 transition-colors">{t.addLocationForm.imageUploaded}</p>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t.addLocationForm.checkPreview}</p>
             </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-blue-50 dark:bg-[#0077b6]/20 text-[#0077b6] dark:text-[#38bdf8] rounded-full flex items-center justify-center mb-4 transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 transition-colors">{t.addLocationForm.uploadImages}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t.addLocationForm.uploadDesc}</p>
            </>
          )}
        </label>
      </section>

      {/* 3. Map Placement */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] dark:bg-[#0077b6]/20 text-[#0077b6] dark:text-[#38bdf8] flex items-center justify-center font-bold">3</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 transition-colors">{t.addLocationForm.mapPlacement}</h2>
        </div>
        <MapPickerDynamic />
        
        <div className="mt-8 space-y-2">
          <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase transition-colors">{t.addLocationForm.shortDescription}</label>
          <Textarea 
            placeholder={t.addLocationForm.shortDescriptionPlaceholder}
            className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 min-h-[120px] resize-none text-slate-800 dark:text-slate-100 transition-colors"
            value={description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4">
        <button 
          onClick={() => {
            reset();
            router.push("/");
          }}
          className="w-full sm:w-auto text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors px-4 py-3 sm:py-2 text-center"
        >
          {t.addLocationForm.cancel}
        </button>
        <button 
          onClick={handlePublish}
          className="w-full sm:w-auto bg-[#0077b6] hover:bg-[#005f92] dark:bg-[#38bdf8] dark:hover:bg-[#0284c7] text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold shadow-md transition-colors text-center"
        >
          {editingId ? "Update Location" : t.addLocationForm.publishLocation}
        </button>
      </div>

    </div>
  );
}
