    import tls from 'tls';
    import http2 from 'http2';
    import colors from 'colors';
    import { Client } from 'discord.js-selfbot-v13';
    // bu kod duckevils x zons x rush tarafından yazılmıştır
    // sıkıldığım için yaptim sniperden cok performans beklemeyin
    // yardım için @duck.js
    // discord.gg/1988
    const availableColors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

    function randomColor(text) {
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    return colors[color](text);
    }

    function renklimesaj(...args) {
    console.log(randomColor(`[${new Date().toLocaleTimeString()}] ${args.join(' ')}`));
    }

    function coloredError(...args) {
    console.error(randomColor(`[${new Date().toLocaleTimeString()}] ${args.join(' ')}`));
    }
// kodu çalıştırdıktan sonra .mfa on yazmayı unutmayın yazmazsanız sniper vb calismicak kullanmadıgınızdada kapatabılırsınız rate yemesin 
// sniper acıkken acık kalsın mfa ellemeyin 
    const client = new Client();
    const token = '';
    const kanalId = '';
    const serverId = '';
    const password = ''; 

    let mfaIntervalId, sniperProcess, isAutokickEnabled = false, mfaToken;

    const simdi = () => {
    const d = new Date(), pad = n => n.toString().padStart(2, '0'),
        ms = d.getMilliseconds().toString().padStart(3, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}:${ms}`;
    };
    const mesajgonder = (id, msg) => {
    const ch = client.channels.cache.get(id);
    if (ch) ch.send(msg).catch(err => coloredError(err));
    };

    client.on('guildMemberAdd', async member => {
    if (isAutokickEnabled && member.guild.id === serverId) {
        try {
        await member.kick('duckevils x zons');
        } catch (error) {
        coloredError(`Failed to kick member ${member.user.tag}: ${error.message}`);
        }
    }
    });

let istekgonderildi = false;
client.on('guildUpdate', async (oldG, newG) => {
    const eski = oldG.vanityURLCode;
    const yeni = newG.vanityURLCode;

    if (eski !== yeni) {
        renklimesaj(`Vanity değişti: ${eski} -> ${yeni}`);
        mesajgonder(
            kanalId,
            `\`${yeni}\` *${simdi()}* ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||ً duckevils @everyone @here https://tenor.com/view/oshi-no-ko-onk-gif-17478208260590297743`
        );

        if (!istekgonderildi && sniperProcess === true) {
            istekgonderildi = true;
            renklimesaj(`update: ${eski} -> ${yeni}. Sending patch request...`);

            const requestBody = { code: eski };
            try {
                const res = await duckevils.istek(
                    "PATCH",
                    `/api/v10/guilds/${serverId}/vanity-url`,
                    {
                        'X-Discord-MFA-Authorization': mfaToken,
                        Cookie: `__Secure-recent_mfa=${mfaToken}`,
                        "Content-Type": "application/json"
                    },
                    JSON.stringify(requestBody)
                );
                renklimesaj('İstek başarılı, (http2) cevap =>', res);
        mesajgonder(
            kanalId,
            `\`${res}\` *${simdi()}* request succesful.`
        );
            } catch (err) {
                coloredError('http2 hatası:', err);
            }
        }
    }
});

    client.on('guildDelete', g => {
    mesajgonder(kanalId, `*Vanity URL \`${g.vanityURLCode}\` was deleted at ${simdi()}*`);
    renklimesaj(`guild delete: ${g.vanityURLCode}`);
    });

    const yardim = message => {
    const helpMessage = `**Komut Listesi:**
    \`.help\` 
    \`.mfa\` – MFA doğrulamayı açar bunu açmadan sniperi açmayın.
    \`.leave\` – Sunucudan ayrılır.
    \`.claim\` – Vanity URL'yi alır.
    \`.vanity\` – Selfdeki urlleri listeler.
    \`.autokick\` – Autokick'i açar veya kapatır.
    \`.pause\` – Davetleri durdurur.
    \`.restart\` – Botu yeniden başlatır.
    \`.delete\` – Vanity URL'yi siler.
    \`.sniper\` – Sniperi açar veya kapatır. on / off
        `;
    message.reply(helpMessage);
    };

    client.on('message', async message => {
    if (message.channel.id !== kanalId) return;
    const [cmd, ...args] = message.content.split(' ');
    switch (cmd) {
        case '.help': return yardim(message);
        case '.leave': {
        const target = args[0];
        const guild = client.guilds.cache.find(g => g.vanityURLCode === target) || client.guilds.cache.get(target);
        return guild ? (await cik(guild.id), message.channel.send(`Left: \`${target}\``)) : message.channel.send('?');
        }
        case '.claim':
        if (!args.length) return message.reply('Please provide a vanity code to claim.');
        urlal(args.join(' '));
        return message.reply(`Claiming \`${args.join(' ')}\``);
        case '.vanity': return duuck();
        case '.autokick': return autokick(message).catch(e => { coloredError(e.message); message.reply('Error processing autokick.'); });
        case '.pause': return davetdurdur();
        case '.restart': return process.exit(0);
        case '.delete': return urlsil();
        case '.mfa':
        if (!mfaIntervalId && args[0] === 'on') { ticket(); mfaIntervalId = setInterval(ticket, 270000); return message.reply('MFA verifying started.'); }
        if (mfaIntervalId && args[0] === 'off') { clearInterval(mfaIntervalId); mfaIntervalId = undefined; return message.reply('MFA stopped.'); }
        return message.reply('Specify `on` or `off`.');
        case '.sniper':
        if (args[0] === 'on') { sniperProcess = true; return message.reply('Sniper enabled.'); }
        if (args[0] === 'off') { sniperProcess = false; return message.reply('Sniper disabled.'); }
        return message.reply('Specify `on` or `off` for sniper.');
    }
    });

    const duuck = () => {
    const urls = client.guilds.cache.filter(g => g.vanityURLCode);
    mesajgonder(kanalId, urls.size ? urls.map(g => `\`${g.vanityURLCode}\``).join(' ') : '?');
    };

    const davetdurdur = async () => {
    const until = new Date(Date.now() + 86400000).toISOString();
    try {
        const res = await fetch(`https://discord.com/api/v9/guilds/${serverId}/incident-actions`, {
        method: 'PUT',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'x-discord-locale': 'en-US',
            'x-discord-timezone': 'Europe/Istanbul'
        },
        body: JSON.stringify({ invites_disabled_until: until, dms_disabled_until: null })
        });
        await res.json();
        mesajgonder(kanalId, 'Davetler \`24 saat\` boyunca durduruldu.');
    } catch (e) { coloredError('Davet durdur hatası:', e); }
    };

    const cik = async id => {
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/guilds/${id}`, { method: 'DELETE', headers: { Authorization: token } });
        res.ok ? renklimesaj(`Left guild: ${id}`) : coloredError(`Failed to leave guild: ${id}`);
    } catch (e) { coloredError(`Leave error (${id}):`, e); }
    };

    async function autokick(message) {
    isAutokickEnabled = !isAutokickEnabled;
    mesajgonder(kanalId, isAutokickEnabled ? 'Autokick \`enabled\`.' : 'Autokick \`disabled\`.');
    }

    async function urlal(vanityCode) {
        try {
        const res = await duckevils.istek("PATCH", `/api/v10/guilds/${serverId}/vanity-url`, {
            'X-Discord-MFA-Authorization': mfaToken,
            Cookie: `__Secure-recent_mfa=${mfaToken}`
        }, JSON.stringify({ code: vanityCode }));
        
        const response = JSON.parse(res);
        renklimesaj('response =>', JSON.stringify(response, null, 2));
        
        if (response.code === 60003) {
            mesajgonder(kanalId, `🔒 **MFA Required**: Please enable MFA first by using \`.mfa on\` before using \`.claim\``);
            renklimesaj('MFA verification needed please toggle .mfa on ');
        }
        } catch (err) {
        coloredError('Error:', err);
        }
    }  async function urlsil() {
        try {
        const res = await duckevils.istek("PATCH", `/api/v10/guilds/${serverId}/vanity-url`, {
            'X-Discord-MFA-Authorization': mfaToken,
            Cookie: `__Secure-recent_mfa=${mfaToken}`
        }, JSON.stringify({ code: "" }));
        
        const response = JSON.parse(res);
        renklimesaj('response =>', JSON.stringify(response, null, 2));
        
        if (response.code === 60003) {
            mesajgonder(kanalId, `🔒 **MFA Required**: Please enable MFA first by using \`.mfa on\` before using \`.delete\``);
            renklimesaj('MFA verification needed - run .mfa on first');
        }
        } catch (err) {
        coloredError('HTTP2 error:', err);
        }
    }
    class duckevilss {
    constructor() { this.createSession(); }
    createSession() {
        this.session?.destroy();
        this.session = http2.connect("https://canary.discord.com", {
        settings: { noDelay: true },
        secureContext: tls.createSecureContext({ ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:AES128-SHA' })
        });
        this.session.on('error', () => setTimeout(() => this.createSession(), 5000));
        this.session.on('close', () => setTimeout(() => this.createSession(), 5000));
    }
    async istek(method, path, customHeaders = {}, body = null) {
        return new Promise((resolve, reject) => {
        const duckevils = { 'Content-Type': 'application/json','Authorization': token, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) duckevils/1.0.1130 Chrome/128.0.6613.186 Electron/32.2.7 Safari/537.36', 'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJwdGIiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC4xMTMwIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDUiLCJvc19hcmNoIjoieDY0IiwiYXBwX2FyY2giOiJ4NjQiLCJzeXN0ZW1fbG9jYWxlIjoidHIiLCJoYXNfY2xpZW50X21vZHMiOmZhbHNlLCJicm93c2VyX3VzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBkaXNjb3JkLzEuMC4xMTMwIENocm9tZS8xMjguMC42NjEzLjE4NiBFbGVjdHJvbi8zMi4yLjcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjMyLjIuNyIsIm9zX3Nka192ZXJzaW9uIjoiMTkwNDUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjozNjY5NTUsIm5hdGl2ZV9idWlsZF9udW1iZXIiOjU4NDYzLCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',  ...customHeaders, ":method": method, ":path": path, ":authority": "discord.com", ":scheme": "https" };
        const stream = this.session.request(duckevils);
        const chunks = [];
        stream.on("data", chunk => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on("error", reject);
        if (body) stream.write(typeof body === 'string' ? body : JSON.stringify(body));
        stream.end();
        });
    }
    }

    async function ticket() {
    try {
        const data = JSON.parse(await duckevils.istek('PATCH', '/api/v9/guilds/0/vanity-url'));
        if (data.code === 200) renklimesaj('MFA gereksinimi yok');
        else if (data.code === 60003) { renklimesaj('Verifying MFA...'); await mfa(data.mfa.ticket); }
        else renklimesaj('Beklenmeyen yanıt kodu:', data.code);
    } catch (error) { coloredError('Ticket işlem hatası:', error); }
    }

    async function mfa(ticket) {
    try {
        const data = JSON.parse(await duckevils.istek('POST', '/api/v9/mfa/finish', { 'Content-Type': 'application/json' }, JSON.stringify({ ticket, mfa_type: 'password', data: password })));
        if (data.token) { mfaToken = data.token; renklimesaj('MFA verified.'); }
        else throw new Error(`Beklenmeyen yanıt: ${JSON.stringify(data)}`);
    } catch (error) { coloredError('MFA doğrulama hatası:', error); }
    }

    client.login(token).catch(e => coloredError('Login error:', e));

    client.once('ready', () => {
    renklimesaj(`Logged in as ${client.user.tag}`);
    mesajgonder(kanalId, `** Selfbot is now running as \`${client.user.tag}\` ** \n[developed by @duck.js](https://discord.gg/1988) `);
    mesajgonder(kanalId, '**Bot is ready!** run the \`.help\` command for help. and use the \`.mfa on\` command to start the mfa verification process.');
    });
    const duckevils = new duckevilss();
