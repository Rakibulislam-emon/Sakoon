export type EmotionId = 'morning' | 'night' | 'anxiety' | 'sadness' | 'overthinking' | 'guilt' | 'emptiness' |'stress' | 'anger' ;

export interface Action {
  type: string;
  arabic: string;
  bangla: string;
  meaning: string;
  count: number;
}

export interface SessionMapping {
  sessionId: string;
  verseIds: string[]; // List of Ayah references to play in order
  action: Action;
  messages: {
    actionPrompt: string;
    completionPause: string;
    endMessage: string;
  };
}

export const emotionsData: Record<EmotionId, SessionMapping[]> = {
  morning: [
    {
      sessionId: 'mrn_session_1',
      verseIds: ['2:255', '112:1', '112:2', '112:3', '112:4', '113:1', '113:2', '113:3', '113:4', '113:5', '114:1', '114:2', '114:3', '114:4', '114:5', '114:6'],
      action: {
        type: 'Dhikr',
        arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ',
        bangla: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
        meaning: 'আল্লাহ পবিত্র এবং তাঁরই সমস্ত প্রশংসা।',
        count: 100
      },
      messages: {
        actionPrompt: "Start your day with His remembrance",
        completionPause: "Feel the Barakah of the morning.",
        endMessage: "Your day is protected."
      }
    },
    {
      sessionId: 'mrn_session_2',
      verseIds: ['59:22', '59:23', '59:24'],
      action: {
        type: 'Istighfar',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        bangla: 'আল্লাহুম্মা আনতা রাব্বি লা ইলাহা ইল্লা আনতা খালাক্বতানি ওয়া আনা আবদুকা ওয়া আনা আলা আহদিকা ওয়া ওয়া’দিকা মাসতাত্বাতু আউজু বিকা মিন শাররি মা সানাতু আবুউ লাকা বিনি’মাতিকা আলাইয়্যা ওয়া আবুউ বিজাম্বি ফাগফিরলি ফাইন্নাহু লা ইয়াগফিরুজ জুনুবা ইল্লা আনতা',
        meaning: 'হে আল্লাহ! আপনি আমার রব, আপনি ছাড়া আর কোনো ইলাহ নেই। আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার বান্দা। আমি আমার সাধ্যমতো আপনার প্রতিশ্রুতি ও অঙ্গীকারের ওপর আছি। আমি আমার কৃতকর্মের অনিষ্ট থেকে আপনার আশ্রয় চাই। আমার ওপর আপনার যে নেয়ামত আছে তার স্বীকৃতি দিচ্ছি এবং আমার পাপও স্বীকার করছি। অতএব, আপনি আমাকে ক্ষমা করুন। নিশ্চয়ই আপনি ছাড়া আর কেউ পাপ ক্ষমা করতে পারে না।',
        count: 1
      },
      messages: {
        actionPrompt: "Seek forgiveness with the Chief of Istighfar.",
        completionPause: "Feel the purity of a clean slate.",
        endMessage: "A fresh start to your day."
      }
    },
    {
      sessionId: 'mrn_session_3',
      verseIds: ['40:1', '40:2', '40:3'],
      action: {
        type: 'Dua',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        bangla: 'বিসমিল্লাহিল্লাজি লা ইয়াদুররু মায়াসমিহি শাইয়ুন ফিল আরদ্বি ওয়ালা ফিস সামায়ি ওয়া হুয়াস সামিউল আলিম',
        meaning: 'সেই আল্লাহর নামে যাঁর নামের বরকতে আসমান ও জমিনের কোনো কিছুই কোনো ক্ষতি করতে পারে না। এবং তিনি সর্বশ্রোতা ও সর্বজ্ঞ।',
        count: 3
      },
      messages: {
        actionPrompt: "Seal your day with His Protection.",
        completionPause: "You are shielded from all harm.",
        endMessage: "Step into the world securely."
      }
    }
  ],
  night: [
    {
      sessionId: 'ngt_session_1',
      verseIds: ['67:1', '67:2', '67:3', '67:4', '67:5', '67:6', '67:7', '67:8', '67:9', '67:10', '67:11', '67:12', '67:13', '67:14', '67:15'], // First half of Al-Mulk for smooth loading
      action: {
        type: 'Dhikr',
        arabic: 'سُبْحَانَ اللّٰهِ، اَلْحَمْدُ لِلّٰهِ، اَللّٰهُ أَكْبَرُ',
        bangla: 'সুবহানাল্লাহ (৩৩), আলহামদুলিল্লাহ (৩৩), আল্লাহু আকবার (৩৪)',
        meaning: 'আল্লাহ পবিত্র (৩৩ বার), সমস্ত প্রশংসা আল্লাহর (৩৩ বার), আল্লাহ সর্বশ্রেষ্ঠ (৩৪ বার)।',
        count: 100
      },
      messages: {
        actionPrompt: "Wash away the fatigue of the day",
        completionPause: "Trust Allah with your worries.",
        endMessage: "Rest peacefully, you are in His care."
      }
    },
    {
      sessionId: 'ngt_session_2',
      verseIds: ['2:285', '2:286'],
      action: {
        type: 'Dua',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        bangla: 'বিসমিকা আল্লাহুম্মা আমুতু ওয়া আহইয়া',
        meaning: 'হে আল্লাহ! আপনার নাম নিয়েই আমি মৃত্যুবরণ করছি (ঘুমাচ্ছি) এবং আপনার নাম নিয়েই আমি পুনর্জীবিত (জাগ্রত) হবো।',
        count: 1
      },
      messages: {
        actionPrompt: "Submit your soul to the Creator of the night.",
        completionPause: "Embrace the tranquility of sleep.",
        endMessage: "May His Angels guard your rest."
      }
    },
    {
      sessionId: 'ngt_session_3',
      verseIds: ['32:1', '32:2', '32:3', '32:4', '32:5'],
      action: {
        type: 'Dua',
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        bangla: 'আল্লাহুম্মা ক্বিনি আযাবাকা ইয়াওমা তাবয়াছু ইবাদাকা',
        meaning: 'হে আল্লাহ! যেদিন আপনি আপনার বান্দাদের পুনরুত্থিত করবেন, সেদিন আমাকে আপনার আযাব থেকে রক্ষা করুন।',
        count: 3
      },
      messages: {
        actionPrompt: "Seek His ultimate protection from the Fire.",
        completionPause: "Safety is granted to those who ask.",
        endMessage: "Sleep with the peace of His mercy."
      }
    }
  ],
  anxiety: [
    { 
      sessionId: 'anx_session_1',
      verseIds: ['55:1', '55:2', '55:3', '55:4', '55:5', '55:6', '55:7', '55:8', '55:9', '55:10', '55:11', '55:12', '55:13', '55:14', '55:15', '55:16'],
      action: {
        type: 'Dhikr',
        arabic: 'حَسْبِيَ اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        bangla: 'হাসবিয়াল্লাহু লা ইলাহা ইল্লা হুয়া আলাইহি তাওয়াক্কালতু ওয়া হুয়া রাব্বুল আরশিল আজিম',
        meaning: 'আল্লাহই আমার জন্য যথেষ্ট, তিনি ছাড়া আর কোনো মাবুদ নেই। আমি তাঁরই ওপর ভরসা করেছি এবং তিনি মহান আরশের অধিপতি।',
        count: 7
      },
      messages: {
        actionPrompt: "Trust in Al-Wakeel and release your anxiety",
        completionPause: "Feel the Sakinah descending.",
        endMessage: "Allah is sufficient for you."
      }
    }
  ],
  sadness: [
    { 
      sessionId: 'sad_session_1',
      verseIds: ['93:1', '93:2', '93:3', '93:4', '93:5', '93:6', '93:7', '93:8', '93:9', '93:10', '93:11', '94:1', '94:2', '94:3', '94:4', '94:5', '94:6', '94:7', '94:8'],
      action: {
        type: 'Dua',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
        bangla: 'আল্লাহুম্মা ইন্নি আউজু বিকা মিনাল হাম্মি ওয়াল হাযানি',
        meaning: 'হে আল্লাহ! নিশ্চয় আমি আপনার আশ্রয় নিচ্ছি দুশ্চিন্তা ও দুঃখ থেকে।',
        count: 10
      },
      messages: {
        actionPrompt: "The Most Merciful knows your pain. Pour your heart out to Him.",
        completionPause: "Find Sakinah in His words.",
        endMessage: "Your tears are seen by Ar-Rahman."
      }
    }
  ],
  overthinking: [
    { 
      sessionId: 'ovr_session_1',
      verseIds: ['65:3', '3:173', '2:153'],
      action: {
        type: 'Dhikr',
        arabic: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        bangla: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নি কুনতু মিনাজ যালিমিন',
        meaning: 'আপনি ছাড়া কোনো ইলাহ নেই, আপনি পবিত্র। নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত।',
        count: 21
      },
      messages: {
        actionPrompt: "Silence the Waswasa. Put your Tawakkul in Him.",
        completionPause: "Rest in the present moment.",
        endMessage: "Allah is the Best of Planners."
      }
    }
  ],
  guilt: [
    { 
      sessionId: 'glt_session_1',
      verseIds: ['39:53', '25:70'],
      action: {
        type: 'Istighfar',
        arabic: 'أَسْتَغْفِرُ اللّٰهَ وَأَتُوبُ إِلَيْهِ',
        bangla: 'আস্তাগফিরুল্লাহ ওয়া আতুবু ইলাইহি',
        meaning: 'আমি আল্লাহর কাছে ক্ষমা চাই এবং তাঁর দিকে ফিরে যাচ্ছি।',
        count: 33
      },
      messages: {
        actionPrompt: "Seek His boundless Maghfirah",
        completionPause: "Feel His forgiveness.",
        endMessage: "Allah loves those who turn back to Him."
      }
    }
  ],
  emptiness: [
    { 
      sessionId: 'emp_session_1',
      verseIds: ['51:56', '50:16', '2:152'],
      action: {
        type: 'Dhikr',
        arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ',
        bangla: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
        meaning: 'আল্লাহ পবিত্র এবং তাঁরই সমস্ত প্রশংসা।',
        count: 33
      },
      messages: {
        actionPrompt: "Your heart was created for His Dhikr. Fill it with Him.",
        completionPause: "Feel His presence.",
        endMessage: "He is closer to you than your jugular vein."
      }
    }
  ],
  stress: [
    {
      sessionId: 'stress_session_1',
      verseIds: ['94:1', '94:2', '94:3', '94:4', '94:5', '94:6', '94:7', '94:8'],
      action: {
        type: 'Dhikr',
        arabic: "لا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّهِ",
        bangla: "লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ",
        meaning: "আল্লাহর সাহায্য ছাড়া আর কোনো শক্তি বা ক্ষমতা নেই।",
        count: 21
      },
      messages: {
        actionPrompt: "Surrender your burdens to Al-Qawiyy. He is enough for you.",
        completionPause: "Feel the weight lifting.",
        endMessage: "With every hardship, there is ease."
      }
    }
  ],
  anger: [
    {
      sessionId: 'anger_session_1',
      verseIds: ['3:134', '7:200', '41:36'],
      action: {
        type: 'Dhikr',
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        bangla: "আউযুবিল্লাহি মিনাশ শায়তানির রাজীম",
        meaning: "আমি বিতাড়িত শয়তান থেকে আল্লাহর আশ্রয় প্রার্থনা করছি।",
        count: 7
      },
      messages: {
        actionPrompt: "Calm the fire within. Seek refuge in Al-Azeez.",
        completionPause: "Let the coolness of Sakinah descend.",
        endMessage: "Control of the self is the true strength."
      }
    }
  ]
};

export const routinesList = [
  { id: 'morning', label: 'Morning Amal' },
  { id: 'night', label: 'Before Sleep' },
] as const;

export const emotionsList = [
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'sadness', label: 'Sadness / Depression' },
  { id: 'overthinking', label: 'Overthinking' },
  { id: 'guilt', label: 'Guilt' },
  { id: 'emptiness', label: 'Emptiness' },
  { id: 'stress', label: 'Stress / Hardship' },
  { id: 'anger', label: 'Anger' },
] as const;
