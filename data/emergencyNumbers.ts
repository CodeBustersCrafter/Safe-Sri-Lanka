export interface EmergencyNumber {
    id: string;
    emoji: string;
    title: string;
    number: string;
  }
  
  export const emergencyNumbers: EmergencyNumber[] = [
    { id: '1', emoji: '🚨', title: 'Emergency Services', number: '911' },
    { id: '2', emoji: '🚑', title: 'Ambulance', number: '102' },
    { id: '3', emoji: '🚒', title: 'Fire Department', number: '101' },
    { id: '4', emoji: '👮', title: 'Police', number: '100' },
    { id: '5', emoji: '🆘', title: "Women's Helpline", number: '1091' },
    { id: '6', emoji: '👶', title: 'Child Helpline', number: '1098' },
  ];