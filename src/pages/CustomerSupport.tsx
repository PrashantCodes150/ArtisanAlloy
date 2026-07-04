import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Clock, Phone, Mail, X, Plus } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
  supportAgent?: {
    name: string;
    avatar?: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export default function CustomerSupport() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showTickets, setShowTickets] = useState(false);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch existing tickets
    const loadInitialData = async () => {
      // Simulate loading initial messages
      const initialMessage: Message = {
        id: '1',
        text: 'Hello! Welcome to ArtisanAlloy Customer Support. I\'m here to help you with any questions about our products, orders, or services. How can I assist you today?',
        sender: 'support',
        timestamp: new Date().toISOString(),
        supportAgent: {
          name: 'Support Assistant',
          avatar: '/support-avatar.png'
        }
      };
      setMessages([initialMessage]);

      await fetchTickets();

      // Scroll to bottom of messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchTickets = async () => {
    try {
      // Mock data - would fetch from API
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          subject: 'Order #12345 - Status Inquiry',
          status: 'resolved',
          priority: 'medium',
          category: 'Order Status',
          description: 'Customer asking about their order delivery timeline',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-12T15:30:00Z',
          messages: []
        },
        {
          id: '2',
          subject: 'Product Return Request',
          status: 'in-progress',
          priority: 'high',
          category: 'Returns & Refunds',
          description: 'Customer wants to return a necklace due to size issues',
          createdAt: '2024-01-11T14:20:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
          messages: []
        }
      ];
      setTickets(mockTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const timestamp = new Date().toISOString();
    const userMessage: Message = {
      id: `msg_${timestamp}`,
      text: inputMessage,
      sender: 'user',
      timestamp: timestamp,
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getSupportResponse(inputMessage),
        sender: 'support',
        timestamp: new Date().toISOString(),
        supportAgent: {
          name: 'Support Assistant',
          avatar: '/support-avatar.png'
        }
      };

      setMessages(prev => [...prev, supportResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getSupportResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Basic keyword-based responses
    if (lowerMessage.includes('order') || lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      return 'Thank you for asking about your order. Let me check the status for you. Could you please provide your order number so I can look that up for you?';
    }

    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return 'I understand you\'d like to process a return. Our return policy allows returns within 30 days of purchase. Please let me know which item you\'d like to return and the reason.';
    }

    if (lowerMessage.includes('product') || lowerMessage.includes('jewelry') || lowerMessage.includes('necklace') || lowerMessage.includes('ring')) {
      return 'I\'d be happy to help you find the perfect jewelry piece! What type of jewelry are you interested in? We have necklaces, rings, earrings, bracelets, and more in various materials like gold, silver, and rose gold.';
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('discount')) {
      return 'Our pricing varies based on materials, craftsmanship, and design complexity. We currently have a 20% off special promotion going on. Would you like me to tell you more about our current offers?';
    }

    return 'Thank you for your message. Let me connect you with one of our human support agents who can better assist you with your specific needs. They\'ll be with you shortly!';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createNewTicket = async () => {
    // This would open a ticket creation form
    console.log('Create new ticket');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets;

  if (!isChatOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <MessageCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Support</h1>
              <p className="text-gray-600 mb-6">We're here to help you 24/7</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setIsChatOpen(true)}
                className="p-6 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors group"
              >
                <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">Start Live Chat</h3>
                <p className="text-gray-600 text-sm">Chat with our support team instantly</p>
              </button>

              <button
                onClick={() => setShowTickets(true)}
                className="p-6 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors group"
              >
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">View My Tickets</h3>
                <p className="text-gray-600 text-sm">Track your support requests</p>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setShowFAQ(true)}
                className="p-6 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors group"
              >
                <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">Browse FAQ</h3>
                <p className="text-gray-600 text-sm">Find quick answers to common questions</p>
              </button>

              <button
                className="p-6 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <Phone className="w-8 h-8 text-gray-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600">Call Support</h3>
                <p className="text-gray-600 text-sm">+1-800-F-JEWELRY</p>
              </button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-4 text-center">
              <Mail className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-purple-700">Email: support@ArtisanAlloy.com</p>
              <Phone className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-purple-700">Phone: +1-800-F-JEWELRY</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Chat Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <h2 className="font-semibold text-gray-900">Live Chat</h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {isTyping ? 'Support is typing...' : 'Online'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200 space-y-2">
            <button
              onClick={() => setShowTickets(!showTickets)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${showTickets
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              My Tickets ({tickets.length})
            </button>

            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${showFAQ
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              FAQ
            </button>

            <button
              onClick={createNewTicket}
              className="w-full text-left px-3 py-2 rounded-lg text-sm bg-purple-600 text-white hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New Ticket
            </button>
          </div>

          {/* Tickets List */}
          {showTickets && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Support Tickets</h3>

                {filteredTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No tickets found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket)}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span>{ticket.category}</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>

                        {activeTicket?.id === ticket.id && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">{ticket.description}</p>
                            <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
                              Continue Conversation
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAQ */}
          {showFAQ && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>

                <div className="space-y-4">
                  {[
                    { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days within India.' },
                    { q: 'What is your return policy?', a: 'We offer 30-day return policy for unused items in original condition.' },
                    { q: 'Do you offer international shipping?', a: 'Yes, we ship to most countries worldwide.' },
                    { q: 'How do I care for my jewelry?', a: 'Store in a dry place, avoid chemicals, and clean gently with a soft cloth.' }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-start cursor-pointer hover:bg-gray-50 p-3">
                        <h4 className="font-medium text-gray-900">{faq.q}</h4>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mt-2">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {message.sender === 'support' && message.supportAgent && (
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          {message.supportAgent.name[0]}
                        </span>
                      </div>
                    )}
                    {message.sender === 'user' && message.user && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {message.user.name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm">{message.text}</p>

                  <div className={`text-xs ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}