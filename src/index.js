const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

const start = async (client) => {
  client.onMessage(async (message) => {
    // Verifica se a mensagem é do tipo chat e não é de um grupo (Mensagem privada)
    if (message.type !== 'chat' || message.isGroupMsg) return;

    // Respostas pré-definidas usando um Map para buscas mais eficientes
    // Pode estar em um arquivo separado ou em um banco de dados
    const answers = new Map([
      ['Oi', 'Oi, tudo bem?'],
      ['E com voce', 'Estou bem, obrigado por perguntar!'],
      ['tarde', 'Boa tarde!'],
      ['dia', 'Bom dia!'],
      ['noite', 'Boa noite!'],
      ['eai', 'E aí, tudo certo?'],
    ]);

    // Normaliza uma string (para evitar problemas com maiúsculas, minúsculas ou acentuação)
    const normalize = (text) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    // Normaliza o corpo da mensagem
    const normalizedMessage = normalize(message.body || '');

    // Procura a primeira correspondência e responde
    for (const [key, response] of answers) {
      if (normalizedMessage.includes(normalize(key))) {
        await client.sendText(message.from, response);
        break; // Para o loop após encontrar uma correspondência
      }
    }
  });
};
