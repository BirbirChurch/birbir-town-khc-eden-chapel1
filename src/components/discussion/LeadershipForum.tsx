import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Shield, 
  Flame, 
  Award, 
  Sparkles, 
  Clock, 
  User, 
  Search,
  BookOpen,
  Heart,
  ChevronRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { LeadershipMessage } from '../../types/chapel';
import { useChapel } from '../../context/ChapelContext';
import { subscribeToChannelMessages, sendChannelMessage } from '../../services/firebase';

export interface ForumChannel {
  id: string;
  title: string;
  badge: string;
  description: string;
  allowedRoles: string[];
  icon: string;
  themeColor: string;
}

export const FORUM_CHANNELS: ForumChannel[] = [
  {
    id: 'joint',
    title: 'አጠቃላይ የመሪዎችና አስተባባሪ የጋራ ውይይት',
    badge: 'የጋራ ጉባኤ',
    description: 'የአስተባባሪው (ወንጌላዊ ገላትያ ደስታ)፣ የአባቶች፣ ሴቶችና ወጣቶች መሪዎች የጋራ መድረክ',
    allowedRoles: ['የቻፕሉ አስተባባሪ', 'አባት መሪ', 'ሴት መሪ', 'ወጣት መሪ', 'ኮሚቴ መሪ'],
    icon: '🏛️',
    themeColor: 'amber'
  },
  {
    id: 'fathers',
    title: 'የአባቶች መሪዎች (ሽማግሌዎች) ጉባኤ',
    badge: 'አባቶች',
    description: 'በአቶ ዳዊት ጫመቶ ሰብሳቢነት የሚመራ የአባቶች ጉባኤና አስተባባሪ ውይይት',
    allowedRoles: ['የቻፕሉ አስተባባሪ', 'አባት መሪ'],
    icon: '👔',
    themeColor: 'blue'
  },
  {
    id: 'women',
    title: 'የሴቶች መሪዎች ጉባኤ',
    badge: 'ሴቶች',
    description: 'በወ/ሮ ምህረት ፎላ ሰብሳቢነት የሚመራ የሴቶች አመራርና አስተባባሪ ውይይት',
    allowedRoles: ['የቻፕሉ አስተባባሪ', 'ሴት መሪ'],
    icon: '🧕',
    themeColor: 'purple'
  },
  {
    id: 'youth',
    title: 'የወጣት መሪዎች ጉባኤ',
    badge: 'ወጣቶች',
    description: 'የወጣቶች ህብረት አስተባባሪዎችና የአስተባባሪው የዕቅድና የአገልግሎት ውይይት',
    allowedRoles: ['የቻፕሉ አስተባባሪ', 'ወጣት መሪ'],
    icon: '⚡',
    themeColor: 'emerald'
  },
  {
    id: 'discipleship',
    title: 'የመንፈሳዊ ትምህርት ቡድኖች አስተባባሪዎች',
    badge: 'ቡድኖች',
    description: 'የ5ቱ መንደሮች የመጽሐፍ ቅዱስ ጥናት አስተባባሪዎችና ጸላያን መሪዎች መድረክ',
    allowedRoles: ['የቻፕሉ አስተባባሪ', 'አባት መሪ', 'ሴት መሪ', 'የቡድን መሪ'],
    icon: '📖',
    themeColor: 'indigo'
  },
  {
    id: 'reconciliation',
    title: 'የእርቅና ሰላም ኮሚቴ ውይይት',
    badge: 'እርቅ',
    description: 'የቤተሰብ ሰላም፣ የእርቅና የሽምግልና ኮሚቴ ውይይት',
    allowedRoles: ['የቻፕሉ አስተባባሪ', 'የእርቅ ኮሚቴ'],
    icon: '🕊️',
    themeColor: 'teal'
  },
  {
    id: 'evangelism',
    title: 'የወንጌል ማህበርተኛ ኮሚቴ',
    badge: 'ወንጌል',
    description: 'የወንጌል ስርጭት፣ አዳዲስ ነፍሳትን የመከታተልና ተልዕኮ ውይይት',
    allowedRoles: ['የቻፕሉ አስተባባሪ', 'የወንጌል ኮሚቴ'],
    icon: '✝️',
    themeColor: 'rose'
  }
];

interface LeadershipForumProps {
  currentPortal: 'coordinator' | 'leaders';
}

export const LeadershipForum: React.FC<LeadershipForumProps> = ({ currentPortal }) => {
  const { committees } = useChapel();
  const [activeChannelId, setActiveChannelId] = useState<string>('joint');
  const [messages, setMessages] = useState<LeadershipMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [searchChannel, setSearchChannel] = useState('');
  
  // Available sender personas to choose from
  const defaultPerson = currentPortal === 'coordinator' 
    ? { name: 'ወንጌላዊ ገላትያ ደስታ', role: 'የቻፕሉ አስተባባሪ', phone: '0910000000' }
    : { name: 'አቶ ዳዊት ጫመቶ', role: 'የአባቶች ሰብሳቢ', phone: '0910926126' };

  const [currentSpeaker, setCurrentSpeaker] = useState(defaultPerson);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compile leader options for persona switcher
  const leaderOptions = [
    { name: 'ወንጌላዊ ገላትያ ደስታ', role: 'የቻፕሉ አስተባባሪ', phone: '0910000000' },
    { name: 'አቶ ዳዊት ጫመቶ', role: 'የአባቶች ሰብሳቢ', phone: '0910926126' },
    { name: 'ተመስገን መርድነህ', role: 'የአባቶች ም/ሰብሳቢ', phone: '0913233676' },
    { name: 'ዳዊት ሞላ', role: '2ኛ ፀሐፊ', phone: '0916470213' },
    { name: 'ምህረት ፎላ', role: 'የሴቶች ሰብሳቢ', phone: '0916401398' },
    { name: 'ደመቀች ዳዊት', role: 'የሴቶች ም/ሰብሳቢ', phone: '0904001943' },
    { name: 'ዳዊት ደሳለኝ', role: 'የእርቅ ኮሚቴ ሰብሳቢ', phone: '0910611930' },
    { name: 'ዘውድቱ አለማየሁ', role: 'የወንጌል ኮሚቴ ሰብሳቢ', phone: '0913249407' },
    { name: 'ማቴዎስ መስቀሌ', role: 'የንብረት ኃላፊ', phone: '0916441389' },
    { name: 'እየብ ታፈሰ', role: 'የሕሳብ ሹም', phone: '0910084177' },
    { name: 'አበራ ፎላ', role: 'ገንዘብ ያዥ', phone: '0912232307' },
    { name: 'በረገነ ባፋ', role: '1ኛ ፀሐፊ', phone: '0910151941' },
    { name: 'ሩት በረገነ', role: 'የወጣቶች መሪ', phone: '0912345675' },
    { name: 'ዮናስ ዳዊት', role: 'የወጣቶች አስተባባሪ', phone: '0912345676' }
  ];

  // Subscribe to real-time Firebase messages for active channel
  useEffect(() => {
    const unsubscribe = subscribeToChannelMessages(activeChannelId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [activeChannelId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeChannel = FORUM_CHANNELS.find(c => c.id === activeChannelId) || FORUM_CHANNELS[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const text = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      await sendChannelMessage(
        activeChannelId,
        currentSpeaker.name,
        currentSpeaker.role,
        text,
        currentSpeaker.phone
      );
    } catch (err) {
      console.error('Failed to send leadership message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickTopic = (topic: string) => {
    setNewMessage(topic);
  };

  const filteredChannels = FORUM_CHANNELS.filter(c => 
    c.title.includes(searchChannel) || c.badge.includes(searchChannel)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                የመሪዎች መወያያ መድረክ
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ቀጥታ መስመር ዝግጁ
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              የኤዴን ቻፕል ዘርፎችና የመሪዎች የጋራ ውይይት
            </h2>
          </div>
        </div>

        {/* Persona identity picker */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300">አሁን የሚናገሩት፦</span>
          <select 
            value={currentSpeaker.name}
            onChange={(e) => {
              const selected = leaderOptions.find(o => o.name === e.target.value);
              if (selected) setCurrentSpeaker(selected);
            }}
            className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            {leaderOptions.map((leader, i) => (
              <option key={i} value={leader.name} className="bg-slate-900 text-white">
                {leader.name} ({leader.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main split: Sidebar channels & Chat area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Channels list */}
        <div className="w-64 sm:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="የውይይት ዘርፍ ፈልግ..."
                value={searchChannel}
                onChange={(e) => setSearchChannel(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              የውይይት ክፍሎች ({FORUM_CHANNELS.length})
            </div>
            {filteredChannels.map((ch) => {
              const isActive = ch.id === activeChannelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-950 border border-amber-500/30 shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{ch.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-semibold truncate ${isActive ? 'text-amber-900 font-bold' : 'text-slate-800'}`}>
                        {ch.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-600 shrink-0 font-medium">
                        {ch.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {ch.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Coordinator privilege note */}
          <div className="p-3 bg-amber-50/60 border-t border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>ማስታወሻ፦</strong> የቻፕሉ አስተባባሪ ወንጌላዊ ገላትያ ደስታ በሁሉም ዘርፎችና ክፍሎች ውስጥ የመወያየትና መመሪያ የመስጠት ሙሉ ፈቃድ አላቸው።
            </p>
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/40 overflow-hidden">
          {/* Active channel info header */}
          <div className="bg-white p-3.5 px-4 border-b border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl">{activeChannel.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {activeChannel.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold">
                    {activeChannel.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {activeChannel.description}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-[11px] text-slate-500 block">ተሳታፊዎች</span>
              <span className="text-xs font-medium text-slate-700">
                {activeChannel.allowedRoles.join('፣ ')}
              </span>
            </div>
          </div>

          {/* Quick topic buttons */}
          <div className="bg-white/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-slate-400 font-medium text-[11px] whitespace-nowrap">ፈጣን አርዕስት፦</span>
            <button 
              onClick={() => handleQuickTopic('የሳምንቱ የጸሎትና የምልጃ አርዕስት፦ ')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] cursor-pointer"
            >
              🙏 የጸሎት አርዕስት
            </button>
            <button 
              onClick={() => handleQuickTopic('የመሪዎች አስቸኳይ ስብሰባ ጥሪ፦ ')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] cursor-pointer"
            >
              📢 የስብሰባ ጥሪ
            </button>
            <button 
              onClick={() => handleQuickTopic('የመንፈሳዊ ጉብኝት ሁኔታ ክትትል፦ ')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] cursor-pointer"
            >
              🏠 የጉብኝት ክትትል
            </button>
            <button 
              onClick={() => handleQuickTopic('የሩብ ዓመት ዕቅድ አፈፃፀም ግምገማ፦ ')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap text-[11px] cursor-pointer"
            >
              📊 የዕቅድ ግምገማ
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                  {activeChannel.icon}
                </div>
                <h4 className="text-sm font-bold text-slate-800">በዚህ ክፍል እስካሁን ምንም መልዕክት የለም</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  የውይይቱን የመጀመሪያ መልዕክት፣ የጸሎት አርዕስት ወይም የአመራር መመሪያ ከዚህ በታች በመጻፍ ይጀምሩ።
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderName === currentSpeaker.name;
                const isCoordinator = msg.senderRole.includes('አስተባባሪ');

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-500">
                      <span className={`font-semibold ${isCoordinator ? 'text-amber-800' : 'text-slate-800'}`}>
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700 font-medium">
                        {msg.senderRole}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-[10px]">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs'
                          : isCoordinator
                          ? 'bg-amber-50 text-slate-900 border border-amber-200/80 rounded-tl-xs shadow-2xs'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <div className="bg-white p-3 border-t border-slate-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`በ${activeChannel.badge} ክፍል ውስጥ ለውይይት መልዕክት ይጻፉ...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
                className="flex-1 p-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="p-2.5 sm:px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">ላክ</span>
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>መልዕክቱ በFirebase Firestore አማካኝነት በቀጥታ ይሰራጫል</span>
              <span className="text-amber-700 font-medium">የመናገሪያ ስም፦ {currentSpeaker.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
