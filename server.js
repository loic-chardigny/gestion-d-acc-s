const NodeMediaServer = require('node-media-server');
const path = require('path');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: false,  // Important pour le streaming en direct
    ping: 30,
    ping_timeout: 60,
    publish_auth: {
      enable: true,     // Sécurité recommandée
      secret: 'votreCleSecrete'
    }
  },
  http: {
    port: 8000,
    mediaroot: path.join(__dirname, 'media'), // Chemin absolu
    allow_origin: '*',
    api: true  // Active l'API de statistiques
  },
  trans: {
    ffmpeg: 'C:/ffmpeg/bin/ffmpeg.exe', // Chemin vérifié
    tasks: [{
      app: 'live',
      hls: true,
      hlsFlags: '[hls_time=2:hls_list_size=3]', // Simplifié
      hlsKeep: false // Permet la rotation des segments
    }]
  },
  auth: {
    api: true,
    api_user: 'admin',
    api_pass: 'password'
  }
};

const nms = new NodeMediaServer(config);

// Logs améliorés
nms.on('prePublish', (id, StreamPath, args) => {
  console.log(`[PUBLISH] Début: ${StreamPath} (${id})`);
  console.log(`Arguments: ${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log(`[PUBLISH] Fin: ${StreamPath} (${id})`);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log(`[PLAY] Début: ${StreamPath} (${id})`);
});

// Gestion des erreurs
nms.on('error', (id, err) => {
  console.error(`[ERREUR] ${id}: ${err.message}`);
});

nms.run();

console.log('=== Serveur Node-Media-Server démarré ===');
console.log(`RTMP: rtmp://10.171.20.45:1935/live`);
console.log(`HLS:  http://10.171.20.45:8000/live/[stream_key]/index.m3u8`);
console.log(`API:  http://10.171.20.45:8000/api/streams`);
console.log(`Dossier média: ${path.resolve(config.http.mediaroot)}`);