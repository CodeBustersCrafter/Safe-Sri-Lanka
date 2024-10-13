export interface EmergencyNumber {
  id: string;
  emoji: string;
  title: string;
  number: string;
}

export const emergencyNumbers: EmergencyNumber[] = [
  { id: '1', emoji: '🚨', title: 'Emergency Police', number: '119' },
  { id: '2', emoji: '🚑', title: 'Suwa Seriya Ambulance', number: '1990' },
  { id: '3', emoji: '👮', title: 'Police Women & Children Bureau', number: '011-2444444' },
  { id: '4', emoji: '🆘', title: "Women's Helpline", number: '1938' },
  { id: '5', emoji: '👶', title: 'Childline Sri Lanka', number: '1929' },
  { id: '7', emoji: '🚒', title: 'Fire & Rescue Service', number: '110' },
  { id: '8', emoji: '🧠', title: 'Mental Health Helpline', number: '1926' },
];
