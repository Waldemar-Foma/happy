exports.handler = async (event) => {
    const { firstName, lastName } = JSON.parse(event.body);
    
    try {
        const response = await fetch('https://api.github.com/repos/Waldemar-Foma/happy/issues', {
            method: 'POST',
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Netlify-Function'
            },
            body: JSON.stringify({
                title: `Гость: ${firstName} ${lastName}`,
                body: `Дата: ${new Date().toISOString()}`,
                labels: ['guest']
            })
        });
        
        return {
            statusCode: response.status,
            body: JSON.stringify(await response.json())
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
