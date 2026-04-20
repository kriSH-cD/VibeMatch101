import { useState, useEffect } from 'react';

// Hardcoded default payload - ready to be swapped with useRealtime
const MOCK_MESSAGES = [
  {
    id: 1,
    name: "Elena Rossi",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrnxeaqVmT4LCL6QqYi3pdA4h_T_i7FcPCwK6xnXIuz9P9abqHrxiX3JqFkgBuan8wV_KZr68QAct4o0M60XAx9KhZ8KUwOYZN7442j_LdD8oeoe1WtQEV8mUIOnZkaiOMBnZQ-EKA0LHx7v-c0eFgD8GLFORIOUU-5El4BYrJFGO9tTuN0iTcM5ypDIpRZ79Vx9J9f9AfPWVQO_H6t9KvS_Cg-xE2IoxN5mILwKKH0yPU5rLb0-LSqDajiK-Wam090PewAXchrdKD",
    time: "2m ago",
    preview: "That coffee spot by the library is amazing! Would love to go back...",
    unreadCount: 2,
    hasRead: false,
    isActive: true
  },
  {
    id: 2,
    name: "Marcus Chen",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5OXMcXX_ae2CGQgf-TpRxev8d_m4sfLjxLqDu91awEu8vzRg3u6YlgK-5ZfNiZ-X3-2THluUk73nEBH3kyvvMhw9DU7ek6EZsstgyEezsdZiJ1mc-_KUmfxDjmr1c_RjGoudbbaJKVnImB6M_lTCT1lCgsX7uUSws2djzEjdfToy3Obe1j_t2NlRGYLjnIZw0Ye-FOhciH4dyOBL9oPsAnmr1OmL-Kvprpp7BbGOSbgTE5tzjVFyh8DAZbpUaKIsZJ0ruubf23fQh",
    time: "1h ago",
    preview: "You: See you at the game tonight then!",
    unreadCount: 0,
    hasRead: true,
    isActive: false
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjbhHihtK8Sx7k8O-thaiG0swMll3_pmPkK0w3Yz76IRYvgLFt8YGY0pC3c97iTWgn17e0IAJPXmAgHFdJZhqqnH06boceBKdynwdW5HYD_inoJa0E_a2j6Xm6wIhn3y8QcscOK-WKHxdxwcA6cw2_ylPkpEAwGZKlJMgwrSHyJ6D7DYpgN3r-RC2DLjudd8C_PdMvIXgffj_6rn6ztcCJcFFoGsv_TZ49fBaybAKs0QjqlMY5ArlJpu39IwIlIJohZAavFZrwz0Yy",
    time: "3h ago",
    preview: "I finally finished that design project! It turned out so well.",
    unreadCount: 0,
    hasRead: true,
    isActive: false
  },
  {
    id: 4,
    name: "Jordan Lee",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB8JuVAAYC8W6WL3COaRAHhuUE9xvo6OI4Ivl2dbnAp2X5lzcpfjl-swmUIjS6jVZIui6KWd5qHKaAFiLi-AyW8x3ep0TV3ESI_GIA2SyPcykPJ4SA2diDU3m4Djvk_7455N7dP134sOYIRxgLrLSkZJkiudkt_KFKD8tkPYdY2Y-Mnou4n14Ryzv_4Paule3wKGKRGeKufLnY8x7IzCIXMiNg4_RCh39iZUhfDoAm-2jnv5qrV08_EpClvBlB8IpyWxtRYDO4yuma",
    time: "Yesterday",
    preview: "Check out this playlist I made for the roadtrip...",
    unreadCount: 1,
    hasRead: false,
    isActive: false
  },
  {
    id: 5,
    name: "Isabella V.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQkXb1crRrwvMISFfpqO7nBAycOhRwdQxLDE0NHtlpnOAlw60-C2GX0VWdblZrNjcAWAg_EDoAW9oi0BodARn24Z3q7BXk5737xqaMobNyhjoN2Fa_0x0rE0MKXLPhpfSs40Hk8Vo2_be56rrZrNt5B3R01QgTyyaSu2RPbKJLx4NeXb0eSlcOrhZG9BcyCPlKSzEH6xKydUkbAcaMfA6SH2UFBTOzkFRD5zgVkq9AFanFC2FHERb9WivqCzWolXkWksrcAG5qSevk",
    time: "Tue",
    preview: "Are you coming to the poetry slam on Friday night?",
    unreadCount: 0,
    hasRead: true,
    isActive: false
  },
  {
    id: 6,
    name: "David Miller",
    avatar: null,
    initial: "D",
    time: "Mon",
    preview: "You: I'll send you the notes from today's lecture.",
    unreadCount: 0,
    hasRead: true,
    isActive: false
  }
];

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a network delay of 400ms for a more realistic UI transition
    const timer = setTimeout(() => {
      setMessages(MOCK_MESSAGES);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return { messages, loading };
};
