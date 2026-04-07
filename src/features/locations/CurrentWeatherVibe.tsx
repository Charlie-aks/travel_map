import { useEffect, useState } from "react";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Thermometer } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface WeatherProps {
  lat: number;
  lng: number;
}

interface WeatherData {
  temperature: number;
  weathercode: number;
}

export function CurrentWeatherVibe({ lat, lng }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        
        if (isMounted && data.current_weather) {
          setWeather({
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
          });
        }
      } catch (error) {
        console.error("Failed to load weather data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  const getWeatherInterpretation = (code: number) => {
    if (code === 0) return { icon: <Sun className="w-5 h-5 text-amber-500" />, key: "clear" };
    if ([1, 2, 3].includes(code)) return { icon: <Cloud className="w-5 h-5 text-slate-400" />, key: "cloudy" };
    if ([45, 48].includes(code)) return { icon: <CloudFog className="w-5 h-5 text-slate-400" />, key: "fog" };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: <CloudDrizzle className="w-5 h-5 text-blue-400" />, key: "drizzle" };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: <CloudRain className="w-5 h-5 text-blue-500" />, key: "rain" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: <CloudSnow className="w-5 h-5 text-slate-300" />, key: "snow" };
    if ([95, 96, 99].includes(code)) return { icon: <CloudLightning className="w-5 h-5 text-purple-500" />, key: "thunderstorm" };
    
    return { icon: <Sun className="w-5 h-5 text-amber-500" />, key: "unknown" };
  };

  if (loading) {
    return (
      <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30 animate-pulse">
        <div className="h-4 bg-sky-200 dark:bg-sky-800/50 w-24 rounded mb-4"></div>
        <div className="h-6 bg-sky-200 dark:bg-sky-800/50 w-16 rounded mb-2"></div>
        <div className="h-4 bg-sky-200 dark:bg-sky-800/50 w-full rounded"></div>
      </div>
    );
  }

  if (!weather) return null;

  const interpretation = getWeatherInterpretation(weather.weathercode);
  const vibeKey = interpretation.key as keyof typeof t.weatherVibes;
  const vibeText = t.weatherVibes[vibeKey] || t.weatherVibes.unknown;

  return (
    <div className="bg-linear-to-br from-[#f0f9ff] to-[#e0f2fe] dark:from-sky-900/20 dark:to-sky-800/20 p-6 rounded-2xl border border-sky-100 dark:border-sky-800/30 shadow-sm relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-200/50 dark:bg-sky-700/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
      
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <Thermometer className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        <span className="text-[10px] font-extrabold text-sky-600 dark:text-sky-500 tracking-wider uppercase">
          {// @ts-ignore - Assuming weatherVibes exists
          t.weatherVibes.title || "Current Vibe"}
        </span>
      </div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
          {interpretation.icon}
          <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{Math.round(weather.temperature)}°C</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-1">
          {vibeText}
        </p>
      </div>
    </div>
  );
}
