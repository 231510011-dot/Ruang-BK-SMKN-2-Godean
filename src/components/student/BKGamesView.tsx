import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import {
  Gamepad2,
  Brain,
  Smile,
  Users,
  Compass,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Heart,
  ShieldCheck,
  Clock,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface BKGamesViewProps {
  user?: User | null;
  onNavigate: (view: string) => void;
}

type GameCategory = 'all' | 'pribadi' | 'sosial' | 'belajar' | 'karier';

export const BKGamesView: React.FC<BKGamesViewProps> = ({ user, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Gamification state
  const [totalScore, setTotalScore] = useState<number>(() => {
    const saved = localStorage.getItem('bk_games_score');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [badges, setBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('bk_games_badges');
    return saved ? JSON.parse(saved) : ['Siswa Reflektif'];
  });

  const addScore = (points: number, badgeName?: string) => {
    const newScore = totalScore + points;
    setTotalScore(newScore);
    localStorage.setItem('bk_games_score', newScore.toString());

    if (badgeName && !badges.includes(badgeName)) {
      const newBadges = [...badges, badgeName];
      setBadges(newBadges);
      localStorage.setItem('bk_games_badges', JSON.stringify(newBadges));
    }
  };

  // --- GAME 1: BK Pribadi - Roda Emosi & Mindful Breathing ---
  const [emotionSelected, setEmotionSelected] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<'tarik' | 'tahan' | 'hembuskan' | 'siap'>('siap');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [pribadiFeedback, setPribadiFeedback] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            // Next phase
            if (breathPhase === 'tarik') {
              setBreathPhase('tahan');
              return 4;
            } else if (breathPhase === 'tahan') {
              setBreathPhase('hembuskan');
              return 4;
            } else if (breathPhase === 'hembuskan') {
              setBreathPhase('tarik');
              setBreathCycles((c) => {
                const nextC = c + 1;
                if (nextC >= 3) {
                  addScore(40, 'Ketenangan Diri');
                  setPribadiFeedback('Hebat! Kamu telah menyelesaikan 3 siklus pernapasan relaksasi. Detak jantungmu kini lebih teratur.');
                }
                return nextC;
              });
              return 4;
            } else {
              setBreathPhase('tarik');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathPhase('tarik');
    setBreathSeconds(4);
    setBreathCycles(0);
    setPribadiFeedback(null);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('siap');
  };

  const emotionsList = [
    {
      name: 'Cemas / Takut',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      tips: 'Perasaan cemas adalah tanda tubuhmu bersiap. Ambil napas dalam 4 detik, dan fokuslah pada hal yang bisa kamu kontrol hari ini.',
    },
    {
      name: 'Kewalahan / Lelah',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      tips: 'Istirahat bukanlah tanda menyerah, melainkan strategi bertahan. Izinkan dirimu rehat sejenak sebelum memulai lagi dengan tugas terkecil.',
    },
    {
      name: 'Kurang Percaya Diri',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      tips: 'Setiap siswa SMK berproses dengan kecepatan berbeda. Ingat satu keahlian praktik yang sudah berhasil kamu kuasai minggu ini.',
    },
    {
      name: 'Bersemangat & Lega',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      tips: 'Energi positif ini sangat baik! Bagikan senyum kepada teman atau manfaatkan untuk menyelesaikan tugas praktik yang menantang.',
    },
  ];

  // --- GAME 2: BK Sosial - Detektif Empati & Anti-Bullying ---
  const socialScenarios = [
    {
      id: 1,
      title: 'Kasus 1: Olokan di Grup Chat WhatsApp Kelas',
      story: 'Di grup WA kelas, salah satu teman mengunggah foto candid seorang siswa yang sedang tertidur di bengkel/lab praktik dengan stiker mengejek. Teman-teman lain mengirimkan emoji tertawa.',
      options: [
        {
          text: 'Ikut menertawakan agar dianggap asyik dan tidak dikucilkan teman-teman.',
          type: 'agresif',
          correct: false,
          feedback: 'Ikut menertawakan memperparah cyberbullying dan melukai perasaan korban.',
        },
        {
          text: 'Diam saja dan pura-pura tidak membaca obrolan grup.',
          type: 'pasif',
          correct: false,
          feedback: 'Sikap pasif (bystander) membuat pelaku merasa tindakannya wajar dan dibiarkan.',
        },
        {
          text: 'Secara asertif menulis di grup: "Teman-teman, yuk hargai privasi dan jangan jadikan foto tidur sebagai bahan tertawaan."',
          type: 'asertif',
          correct: true,
          feedback: 'Tepat sekali! Sikap asertif membela teman tanpa kekerasan adalah ciri siswa berkarakter kuat dan berempati tinggi.',
        },
      ],
    },
    {
      id: 2,
      title: 'Kasus 2: Penolakan Rekan Kelompok Praktik',
      story: 'Saat pembagian kelompok tugas praktik kejuruan, seorang teman yang pendiam tidak diajak oleh kelompok manapun karena dinilai kurang aktif.',
      options: [
        {
          text: 'Mengajaknya bergabung ke kelompokmu dan membagi tugas sesuai kelebihan masing-masing.',
          type: 'asertif',
          correct: true,
          feedback: 'Pilihan luar biasa! Setiap orang memiliki potensi jika diberi ruang kerja sama yang saling mendukung.',
        },
        {
          text: 'Menghindarinya karena takut nilai praktik kelompokmu menurun.',
          type: 'agresif',
          correct: false,
          feedback: 'Mengabaikan teman mempersempit kesempatan saling belajar dan menumbuhkan kepedulian sosial.',
        },
        {
          text: 'Menunggu instruksi guru saja tanpa mengambil inisiatif sosial.',
          type: 'pasif',
          correct: false,
          feedback: 'Inisiatif empati mandiri jauh lebih dihargai daripada pasif menunggu teguran.',
        },
      ],
    },
    {
      id: 3,
      title: 'Kasus 3: Membedakan Guyonan vs Perundungan',
      story: 'Temanmu sering disembunyikan helm motornya setiap pulang sekolah dan dia tampak tersenyum canggung tapi tertekan.',
      options: [
        {
          text: 'Menilai itu hanya bercanda biasa karena korban ikut tersenyum.',
          type: 'pasif',
          correct: false,
          feedback: 'Senyum canggung sering kali adalah respon proteksi diri korban yang takut melawan.',
        },
        {
          text: 'Mendatangi teman tersebut secara empatik di waktu privat dan menanyakan apakah ia merasa terganggu atau butuh bantuan.',
          type: 'asertif',
          correct: true,
          feedback: 'Sangat bijak! Memastikan kenyamanan korban secara privat menciptakan ruang aman untuk bercerita.',
        },
        {
          text: 'Membalas menyembunyikan helm si pelaku agar dia kapok.',
          type: 'agresif',
          correct: false,
          feedback: 'Membalas dengan tindakan serupa hanya akan menciptakan lingkaran konflik baru.',
        },
      ],
    },
  ];
  const [currentSocialIndex, setCurrentSocialIndex] = useState(0);
  const [socialAnswered, setSocialAnswered] = useState<number | null>(null);
  const [socialScore, setSocialScore] = useState(0);

  const handleSelectSocialOption = (index: number) => {
    if (socialAnswered !== null) return;
    setSocialAnswered(index);
    const isCorrect = socialScenarios[currentSocialIndex].options[index].correct;
    if (isCorrect) {
      setSocialScore((s) => s + 35);
      addScore(35, 'Duta Empati');
    }
  };

  const nextSocialScenario = () => {
    setSocialAnswered(null);
    if (currentSocialIndex < socialScenarios.length - 1) {
      setCurrentSocialIndex((prev) => prev + 1);
    } else {
      // Finished
      addScore(50, 'Master Hubungan Sosial');
    }
  };

  const resetSocialGame = () => {
    setCurrentSocialIndex(0);
    setSocialAnswered(null);
    setSocialScore(0);
  };

  // --- GAME 3: BK Belajar - Tantangan Matriks Skala Prioritas Eisenhower ---
  const taskItems = [
    {
      id: 1,
      title: 'Laporan Tugas Proyek Praktik deadline besok jam 07.30',
      correctQuadrant: 1, // Penting & Mendesak
      explanation: 'Deadline sangat dekat dan memiliki konsekuensi nilai langsung. Kerjakan sekarang!',
    },
    {
      id: 2,
      title: 'Mempersiapkan materi Uji Sertifikasi Kompetensi (2 bulan lagi)',
      correctQuadrant: 2, // Penting & Tidak Mendesak
      explanation: 'Kunci kesuksesan SMK adalah mencicil latihan kejuruan sebelum mepet ujian. Jadwalkan secara teratur!',
    },
    {
      id: 3,
      title: 'Notifikasi pesan chat grup game online yang sedang ramai',
      correctQuadrant: 4, // Tidak Penting & Tidak Mendesak
      explanation: 'Distraksi waktu terbesar. Batasi dan singkirkan saat sedang jam belajar fokus.',
    },
    {
      id: 4,
      title: 'Diajak teman membeli jajan saat kamu sedang menyelesaikan job sheet',
      correctQuadrant: 3, // Mendesak tapi Kurang Penting
      explanation: 'Sampaikan secara asertif untuk menyusul nanti setelah tugasmu selesai.',
    },
    {
      id: 5,
      title: 'Menjaga kesehatan dengan tidur teratur 7-8 jam per hari',
      correctQuadrant: 2, // Penting & Tidak Mendesak
      explanation: 'Fondasi konsentrasi otak di bengkel/lab praktik adalah istirahat berkualitas. Investasi jangka panjang!',
    },
  ];

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskFeedback, setTaskFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [belajarScore, setBelajarScore] = useState(0);

  const handleClassifyTask = (quadrantNumber: number) => {
    if (taskFeedback) return;
    const task = taskItems[currentTaskIndex];
    const isCorrect = task.correctQuadrant === quadrantNumber;

    if (isCorrect) {
      setBelajarScore((s) => s + 25);
      addScore(25, 'Jawara Skala Prioritas');
      setTaskFeedback({
        isCorrect: true,
        text: `Tepat sekali! ${task.explanation}`,
      });
    } else {
      setTaskFeedback({
        isCorrect: false,
        text: `Kurang tepat. ${task.explanation}`,
      });
    }
  };

  const nextBelajarTask = () => {
    setTaskFeedback(null);
    if (currentTaskIndex < taskItems.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
    } else {
      addScore(50, 'Master Manajemen Waktu');
    }
  };

  const resetBelajarGame = () => {
    setCurrentTaskIndex(0);
    setTaskFeedback(null);
    setBelajarScore(0);
  };

  // --- GAME 4: BK Karier - Holland RIASEC SMK Career Quest ---
  const riasecQuestions = [
    {
      id: 1,
      question: 'Aktivitas praktik mana yang paling membuatmu betah berjam-jam?',
      options: [
        { text: 'Memperbaiki mesin, menyetel peralatan teknik, atau merakit benda nyata.', type: 'R' },
        { text: 'Merancang pola busana, menggambar sketsa, dan mendesain ornamen estetis.', type: 'A' },
        { text: 'Menghitung estimasi biaya bahan, membuat laporan stok barang yang rapi.', type: 'C' },
        { text: 'Menjelaskan cara kerja kejuruan kepada teman atau melayani pelanggan.', type: 'S' },
      ],
    },
    {
      id: 2,
      question: 'Jika kamu diberi modal awal di SMK, proyek mana yang ingin kamu pimpin?',
      options: [
        { text: 'Mendirikan bengkel servis teknik atau studio produksi interior arsitektur.', type: 'R' },
        { text: 'Menciptakan brand clothing fesyen dengan desain unik karya sendiri.', type: 'A' },
        { text: 'Membuka agensi pemasaran online dan mengelola strategi penjualan produk.', type: 'E' },
        { text: 'Menjadi konsultan pelatihan keterampilan kerja bagi adik-adik kelas.', type: 'S' },
      ],
    },
    {
      id: 3,
      question: 'Keahlian non-teknis apa yang paling ingin kamu asah untuk masa depan?',
      options: [
        { text: 'Ketelitian dalam menganalisis gambar teknik atau konstruksi detail.', type: 'I' },
        { text: 'Kreativitas menciptakan tren visual yang belum pernah ada sebelumnya.', type: 'A' },
        { text: 'Kemampuan negosiasi, memimpin tim, dan mengambil risiko wirausaha.', type: 'E' },
        { text: 'Kerapian dokumentasi kerja, disiplin SOP, dan ketepatan administrasi.', type: 'C' },
      ],
    },
  ];

  const [careerAnswers, setCareerAnswers] = useState<string[]>([]);
  const [careerResult, setCareerResult] = useState<{
    code: string;
    title: string;
    description: string;
    bmwPath: { bekerja: string; kuliah: string; wirausaha: string };
  } | null>(null);

  const handleAnswerCareer = (type: string) => {
    const updated = [...careerAnswers, type];
    setCareerAnswers(updated);

    if (updated.length === riasecQuestions.length) {
      // Calculate dominant types
      const counts: Record<string, number> = {};
      updated.forEach((t) => (counts[t] = (counts[t] || 0) + 1));
      const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
      const dominant = sorted[0] || 'R';

      let res = {
        code: `${dominant}-Tipe Unggulan`,
        title: 'Praktisi Realistis & Kreatif',
        description: 'Kamu memiliki kecenderungan menyukai tindakan nyata, pemecahan masalah konkret, dan ketelitian kerja khas siswa kejuruan.',
        bmwPath: {
          bekerja: 'Teknisi profesional, Drafter/Modeler DPB, Pattern Maker Busana, Mekanik Ahli TKKR.',
          kuliah: 'D4/S1 Teknik Mesin/Otomotif, Desain Interior/Arsitektur, Pendidikan Vokasi.',
          wirausaha: 'Membuka bengkel spesialis modern, butik/konveksi mandiri, biro desain gambar 3D.',
        },
      };

      if (dominant === 'A') {
        res = {
          code: 'Artistik (Artistic-Creator)',
          title: 'Kreator & Desainer Inovatif',
          description: 'Kamu memiliki kepekaan visual, rasa estetika yang tajam, dan senang bereksperimen dengan orisinalitas karya.',
          bmwPath: {
            bekerja: 'Fashion Designer, Visual Merchandiser, Desainer Grafis/Interior, Stylist.',
            kuliah: 'S1/D4 Desain Mode & Busana, Desain Komunikasi Visual, Seni Rupa Terapan.',
            wirausaha: 'Brand fashion independen, studio custom apparel, dekorasi panggung & event.',
          },
        };
      } else if (dominant === 'E') {
        res = {
          code: 'Enterprising (Pebisnis & Penggerak)',
          title: 'Leader & Technopreneur SMK',
          description: 'Kamu memiliki jiwa kepemimpinan, berani berkomunikasi, dan pintar melihat peluang ekonomi dari keahlian teknis.',
          bmwPath: {
            bekerja: 'Koordinator Produksi, Sales Engineer, Supervisor Bengkel/Gerai, Account Executive.',
            kuliah: 'S1 Manajemen Bisnis, Kewirausahaan, Teknik Industri Terapan.',
            wirausaha: 'Distributor spare part, toko konveksi seragam skala besar, jasa kontraktor muda.',
          },
        };
      }

      setCareerResult(res);
      addScore(60, 'Eksplorator Karier SMK');
    }
  };

  const resetCareerGame = () => {
    setCareerAnswers([]);
    setCareerResult(null);
  };

  const gamesCatalog = [
    {
      id: 'pribadi',
      title: 'Taman Pikiran & Pernapasan Mindful',
      bidang: 'BK Pribadi',
      category: 'pribadi' as GameCategory,
      icon: Smile,
      badge: 'Regulasi Emosi',
      color: 'from-purple-500 to-indigo-600',
      desc: 'Kenali emosi yang kamu rasakan hari ini dan ikuti panduan visual napas 4-4-4 untuk menurunkan ketegangan pikiran.',
    },
    {
      id: 'sosial',
      title: 'Detektif Empati & Anti-Bullying',
      bidang: 'BK Sosial',
      category: 'sosial' as GameCategory,
      icon: Users,
      badge: 'Hubungan Sebaya',
      color: 'from-blue-500 to-cyan-600',
      desc: 'Pecahkan skenario pertemanan di sekolah: tentukan respon asertif dan lawan tindakan perundungan dengan bijak.',
    },
    {
      id: 'belajar',
      title: 'Tantangan Matriks Skala Prioritas',
      bidang: 'BK Belajar',
      category: 'belajar' as GameCategory,
      icon: Clock,
      badge: 'Manajemen Waktu',
      color: 'from-amber-500 to-orange-600',
      desc: 'Klasifikasikan tugas proyek, persiapan uji kejuruan, dan distraksi harian ke dalam kuadran penting & mendesak.',
    },
    {
      id: 'karier',
      title: 'Holland RIASEC SMK Career Quest',
      bidang: 'BK Karier',
      category: 'karier' as GameCategory,
      icon: Compass,
      badge: 'Orientasi BMW',
      color: 'from-emerald-500 to-teal-600',
      desc: 'Jawab skenario kejuruan untuk mengungkap tipe kepribadian kariermu serta peta jalan Bekerja, Melanjutkan, Wirausaha.',
    },
  ];

  const filteredGames = selectedCategory === 'all'
    ? gamesCatalog
    : gamesCatalog.filter((g) => g.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            <span>Permainan Edukatif Bimbingan & Konseling</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Game Online Ruang BK SMKN 2 Godean 🎮
          </h1>

          <p className="mt-2 text-sm sm:text-base text-indigo-100">
            Belajar mengenal diri, memperkuat empati sosial, menata prioritas belajar, dan merancang masa depan karier dengan cara yang seru dan interaktif.
          </p>

          {/* Gamification Stats Bar */}
          <div className="mt-5 flex flex-wrap items-center gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold text-white">
                Poin Edukasi: <strong className="text-amber-300">{totalScore} XP</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Award className="w-4 h-4 text-pink-300" />
              <span className="text-xs font-bold text-white">
                Lencana Diraih: <strong className="text-pink-200">{badges.length}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 text-[10px] font-extrabold shadow-xs"
                >
                  🏅 {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setActiveGameId(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Permainan (4 Bidang)
        </button>
        <button
          onClick={() => {
            setSelectedCategory('pribadi');
            setActiveGameId('pribadi');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'pribadi'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200'
          }`}
        >
          💜 BK Pribadi
        </button>
        <button
          onClick={() => {
            setSelectedCategory('sosial');
            setActiveGameId('sosial');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'sosial'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
          }`}
        >
          💙 BK Sosial
        </button>
        <button
          onClick={() => {
            setSelectedCategory('belajar');
            setActiveGameId('belajar');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'belajar'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200'
          }`}
        >
          💛 BK Belajar
        </button>
        <button
          onClick={() => {
            setSelectedCategory('karier');
            setActiveGameId('karier');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'karier'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
          }`}
        >
          💚 BK Karier
        </button>
      </div>

      {/* Game Stage Area (if active) */}
      {activeGameId ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              onClick={() => setActiveGameId(null)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              ← Kembali ke Menu Permainan
            </button>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Modul Interaktif BK
            </span>
          </div>

          {/* ACTIVE GAME 1: BK PRIBADI */}
          {activeGameId === 'pribadi' && (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  Bidang Bimbingan Pribadi
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  Taman Regulasi Emosi & Mindful Breathing
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Bagian 1: Pilih kondisi perasaanmu saat ini untuk mendapatkan afirmasi positif.
                  Bagian 2: Lakukan latihan pernapasan ritmis untuk meredakan ketegangan tubuh.
                </p>
              </div>

              {/* Emotion Selector */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Langkah 1: Bagaimana cuaca perasaanmu hari ini?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {emotionsList.map((emo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setEmotionSelected(emo.name)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        emotionSelected === emo.name
                          ? `${emo.color} ring-2 ring-purple-600 shadow-xs font-bold`
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{emo.name}</p>
                    </button>
                  ))}
                </div>

                {emotionSelected && (
                  <div className="mt-3 p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-purple-950 mb-0.5">Catatan Bimbingan untukmu:</p>
                      <p>
                        {emotionsList.find((e) => e.name === emotionSelected)?.tips}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Breathing Circle Mini Game */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-100 flex flex-col items-center text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-4">
                  Langkah 2: Latihan Napas Relaksasi Berirama
                </p>

                {/* Animated Breathing Circle */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                      breathPhase === 'tarik'
                        ? 'bg-purple-300/60 scale-100'
                        : breathPhase === 'tahan'
                        ? 'bg-indigo-300/60 scale-105'
                        : breathPhase === 'hembuskan'
                        ? 'bg-sky-200/50 scale-75'
                        : 'bg-slate-200/60 scale-90'
                    }`}
                  ></div>

                  <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white shadow-lg border border-purple-200 flex flex-col items-center justify-center p-4">
                    {breathPhase === 'siap' ? (
                      <p className="text-xs font-bold text-slate-600">Klik Mulai Napas</p>
                    ) : (
                      <>
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                          {breathPhase === 'tarik' && 'Tarik Napas...'}
                          {breathPhase === 'tahan' && 'Tahan Sebentar...'}
                          {breathPhase === 'hembuskan' && 'Hembuskan Perlahan...'}
                        </p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-1">
                          {breathSeconds}s
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Siklus ke-{breathCycles + 1} / 3
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {pribadiFeedback && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pribadiFeedback}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {!isBreathingActive ? (
                    <button
                      onClick={startBreathing}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>Mulai Sesi Napas 3 Siklus</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopBreathing}
                      className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Hentikan Sesi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE GAME 2: BK SOSIAL */}
          {activeGameId === 'sosial' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    Bidang Bimbingan Sosial
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Detektif Empati: Pecahkan Dilema Pertemanan SMK
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Skor Empati</span>
                  <p className="text-lg font-extrabold text-blue-700">+{socialScore} XP</p>
                </div>
              </div>

              {/* Scenario Card */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Kasus {currentSocialIndex + 1} dari {socialScenarios.length}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Karakter & Anti-Bullying
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {socialScenarios[currentSocialIndex].title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 leading-relaxed">
                  "{socialScenarios[currentSocialIndex].story}"
                </p>

                <p className="text-xs font-bold text-slate-700 pt-2">
                  Sebagai teman yang berkarakter, tindakan apa yang kamu ambil?
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {socialScenarios[currentSocialIndex].options.map((opt, i) => {
                    const isSelected = socialAnswered === i;
                    let btnStyle = 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-800';

                    if (socialAnswered !== null) {
                      if (opt.correct) {
                        btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-400';
                      } else if (isSelected && !opt.correct) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                      } else {
                        btnStyle = 'bg-white opacity-50 border-slate-200 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectSocialOption(i)}
                        disabled={socialAnswered !== null}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <div className="flex-1">
                          <p>{opt.text}</p>
                          {isSelected && (
                            <p className="mt-2 text-xs font-bold">
                              {opt.feedback}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {socialAnswered !== null && (
                  <div className="pt-3 flex justify-end">
                    {currentSocialIndex < socialScenarios.length - 1 ? (
                      <button
                        onClick={nextSocialScenario}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Kasus Berikutnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={resetSocialGame}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Selesaikan & Main Lagi</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE GAME 3: BK BELAJAR */}
          {activeGameId === 'belajar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Bidang Bimbingan Belajar
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Tantangan Matriks Skala Prioritas (Eisenhower Quest)
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Skor Fokus</span>
                  <p className="text-lg font-extrabold text-amber-700">+{belajarScore} XP</p>
                </div>
              </div>

              {/* Task Card to Classify */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Aktivitas {currentTaskIndex + 1} dari {taskItems.length}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Manajemen Waktu SMK
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-amber-300/80 shadow-xs text-center space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Klasifikasikan Kegiatan Ini:
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    "{taskItems[currentTaskIndex].title}"
                  </h3>
                </div>

                {/* 4 Eisenhower Quadrants */}
                <p className="text-xs font-bold text-slate-700 text-center">
                  Klik kuadran yang paling tepat untuk kegiatan di atas:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleClassifyTask(1)}
                    disabled={taskFeedback !== null}
                    className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-rose-800">
                        Kuadran 1: PENTING & MENDESAK
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                        DO IT NOW
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700">
                      Tugas krusial berdeadline sangat mepet (krisis/darurat).
                    </p>
                  </button>

                  <button
                    onClick={() => handleClassifyTask(2)}
                    disabled={taskFeedback !== null}
                    className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-blue-800">
                        Kuadran 2: PENTING TAPI TIDAK MENDESAK
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900">
                        PLAN IT
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      Investasi masa depan: belajar persiapan ujian, jaga kesehatan.
                    </p>
                  </button>

                  <button
                    onClick={() => handleClassifyTask(3)}
                    disabled={taskFeedback !== null}
                    className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-amber-800">
                        Kuadran 3: MENDESAK TAPI KURANG PENTING
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                        DELEGATE / LIMIT
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Gangguan mendadak orang lain, ajakan nongkrong tak terencana.
                    </p>
                  </button>

                  <button
                    onClick={() => handleClassifyTask(4)}
                    disabled={taskFeedback !== null}
                    className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-slate-800">
                        Kuadran 4: TIDAK PENTING & TIDAK MENDESAK
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-300 text-slate-900">
                        ELIMINATE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Pemboros waktu: scroll medsos berjam-jam tanpa arah.
                    </p>
                  </button>
                </div>

                {taskFeedback && (
                  <div
                    className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${
                      taskFeedback.isCorrect
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-50 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {taskFeedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold mb-0.5">
                        {taskFeedback.isCorrect ? 'Jawaban Benar!' : 'Evaluasi Belajar:'}
                      </p>
                      <p>{taskFeedback.text}</p>
                    </div>
                  </div>
                )}

                {taskFeedback && (
                  <div className="pt-2 flex justify-end">
                    {currentTaskIndex < taskItems.length - 1 ? (
                      <button
                        onClick={nextBelajarTask}
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Aktivitas Selanjutnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={resetBelajarGame}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Selesai & Ulangi Latihan</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE GAME 4: BK KARIER */}
          {activeGameId === 'karier' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Bidang Bimbingan Karier
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Holland RIASEC & BMW Career Quest
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">Target</span>
                  <p className="text-xs font-bold text-emerald-700">Jurusan: {user?.major || 'SMK'}</p>
                </div>
              </div>

              {!careerResult ? (
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Pertanyaan {careerAnswers.length + 1} dari {riasecQuestions.length}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Minat & Kepribadian Karier
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 bg-white p-4 rounded-2xl border border-slate-200">
                    {riasecQuestions[careerAnswers.length]?.question}
                  </h3>

                  <p className="text-xs font-bold text-slate-700 pt-1">
                    Pilih salah satu yang paling mencerminkan dirimu:
                  </p>

                  <div className="space-y-2.5">
                    {riasecQuestions[careerAnswers.length]?.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerCareer(opt.type)}
                        className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-xs sm:text-sm text-slate-800 transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-emerald-100 group-hover:text-emerald-800 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Career Result Card */
                <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-300 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Hasil Eksplorasi Karier Holland:
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {careerResult.title} ({careerResult.code})
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-4 rounded-2xl border border-emerald-200">
                    {careerResult.description}
                  </p>

                  {/* BMW Pathway Matrix */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                      Rekomendasi Jalur BMW (Bekerja • Melanjutkan • Wirausaha):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold block w-fit mb-1.5">
                          B - Bekerja
                        </span>
                        <p className="text-xs text-slate-700">
                          {careerResult.bmwPath.bekerja}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold block w-fit mb-1.5">
                          M - Melanjutkan Kuliah
                        </span>
                        <p className="text-xs text-slate-700">
                          {careerResult.bmwPath.kuliah}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold block w-fit mb-1.5">
                          W - Wirausaha
                        </span>
                        <p className="text-xs text-slate-700">
                          {careerResult.bmwPath.wirausaha}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200">
                    <button
                      onClick={resetCareerGame}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi Kuis Karier</span>
                    </button>

                    <button
                      onClick={() => onNavigate('career')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Buka Portal Karier & PKL Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Game Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredGames.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {game.bidang}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
                    {game.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {game.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Dapatkan Poin & Lencana</span>
                  </span>

                  <button
                    onClick={() => setActiveGameId(game.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Mainkan Game</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Counselor Note */}
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <p>
          <strong>Catatan Guru BK SMKN 2 Godean:</strong> Permainan edukatif ini dirancang untuk membantumu melatih kepekaan diri secara santai. Jika ada hasil atau pikiran yang ingin kamu diskusikan lebih dalam, kamu selalu bisa mengirim curhat privat melalui menu <strong>Konsultasi BK</strong>.
        </p>
      </div>
    </div>
  );
};
