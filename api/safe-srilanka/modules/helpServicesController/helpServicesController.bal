import safe_srilanka.models as models;

// In-memory storage for Emergency Numbers
final models:EmergencyNumber[] emergencyNumbers = [
    { id: "1", emoji: "🚨", title: "Emergency Services", number: "119" },
    { id: "2", emoji: "🚑", title: "Ambulance", number: "1990" },
    { id: "3", emoji: "🚒", title: "Fire Department", number: "110" },
    { id: "4", emoji: "👮", title: "Police", number: "119" },
    { id: "5", emoji: "🆘", title: "Women's Helpline", number: "1938" },
    { id: "6", emoji: "👶", title: "Child Helpline", number: "1929" }
];

// Function to get Helpline Numbers
public function getHelplineNumbers() returns json {
    return { "helplines": emergencyNumbers }.toJson();
}