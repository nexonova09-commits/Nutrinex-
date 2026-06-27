// DeepSeek AI Client (NOVA)
class NovaAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.deepseek.com/chat/completions';
        this.conversationHistory = [];
    }

    async chat(userMessage) {
        try {
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: this.conversationHistory,
                    temperature: 0.7,
                    max_tokens: 500,
                    system: `Tu es NOVA, l'assistante nutritionniste IA de NutriNex. Tu as été créée par Youssef Sylla, fondateur de NutriNex. Tu fournis des conseils nutritionnels personnalisés, basés sur les habitudes alimentaires et les objectifs de l'utilisateur. Sois amical, encourageant et pratique.`
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage = data.choices[0].message.content;

            this.conversationHistory.push({
                role: 'assistant',
                content: aiMessage
            });

            return aiMessage;
        } catch (error) {
            console.error('NOVA AI error:', error);
            return "Désolée, je n'arrive pas à répondre pour le moment. Réessayez plus tard.";
        }
    }

    getWhoCreatedMe() {
        return "J'ai été créée par Youssef Sylla, fondateur de NutriNex.";
    }
}

const nova = new NovaAI(CONFIG.DEEPSEEK_API_KEY);
window.nova = nova;