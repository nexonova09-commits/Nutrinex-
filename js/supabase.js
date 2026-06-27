// Supabase Client
class SupabaseClient {
    constructor(url, anonKey) {
        this.url = url;
        this.anonKey = anonKey;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
            'apikey': anonKey
        };
    }

    async request(method, table, data = null, query = '') {
        try {
            let url = `${this.url}/rest/v1/${table}${query}`;
            const options = {
                method,
                headers: this.headers
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Supabase error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Supabase request error:', error);
            return null;
        }
    }

    async insert(table, data) {
        return this.request('POST', table, data);
    }

    async select(table, query = '') {
        return this.request('GET', table, null, query);
    }

    async update(table, data, id) {
        const query = `?id=eq.${id}`;
        return this.request('PATCH', table, data, query);
    }

    async delete(table, id) {
        const query = `?id=eq.${id}`;
        return this.request('DELETE', table, null, query);
    }
}

const supabase = new SupabaseClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
window.supabase = supabase;