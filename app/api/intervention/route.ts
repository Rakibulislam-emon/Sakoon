import { NextResponse } from 'next/server';
import { EmotionId, emotionsData } from '@/lib/emotions';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emotion = searchParams.get('emotion') as EmotionId;

  if (!emotion || !emotionsData[emotion]) {
    return NextResponse.json({ error: 'Invalid or missing emotion parameter' }, { status: 400 });
  }

  // Randomly select a session for this emotion
  const sessions = emotionsData[emotion];
  const selectedSession = sessions[Math.floor(Math.random() * sessions.length)];

  try {
    // Fetch ALL verses sequentially to avoid rate-limiting from the free API
    const verses = [];
    for (const ayahId of selectedSession.verseIds) {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahId}/editions/quran-uthmani,bn.bengali,ar.alafasy`, {
        next: { revalidate: 3600 } 
      });
      
      const json = await res.json();

      if (json.code !== 200) {
        console.error(`Failed to fetch verse ${ayahId}`, json);
        continue;
      }

      const arabicData = json.data[0];
      const banglaData = json.data[1];
      const audioData = json.data[2];

      // Force HTTPS on audio URL — http:// URLs are blocked by mobile carriers (mixed content)
      const secureAudioUrl = (audioData.audio as string).replace(/^http:\/\//i, 'https://');

      verses.push({
        ayahId: ayahId,
        arabic: arabicData.text,
        translation: banglaData.text,
        audioUrl: secureAudioUrl,
        surahName: arabicData.surah.name,
        surahEnglishName: arabicData.surah.englishName,
        numberInSurah: arabicData.numberInSurah
      });
    }

    return NextResponse.json({
      sessionId: selectedSession.sessionId,
      action: selectedSession.action,
      messages: selectedSession.messages,
      verses: verses
    });
  } catch (error) {
    console.error('Error fetching Quran data:', error);
    return NextResponse.json({ error: 'Failed to fetch guidance' }, { status: 500 });
  }
}
