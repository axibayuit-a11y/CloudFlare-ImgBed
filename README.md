# CloudFlare ImgBed

A free, open-source file hosting solution with full lifecycle management.

## Features

### Storage Backends
- Telegram Channel
- Discord
- Cloudflare R2
- Amazon S3
- Huggingface

### Deployment Options
- Cloudflare Pages (serverless)
- Docker / Docker Compose

### Core Features
- **File Management**: Upload, browse, delete, and organize files
- **Authentication**: Password protection and admin dashboard
- **Directory Support**: Organize files into folders
- **Image Moderation**: Content filtering and review
- **Random Image API**: Serve random images from your collection
- **WebDAV Protocol**: Mount as network drive
- **RESTful API**: Programmatic access to all features
- **Public Gallery**: Optional public browsing mode
- **Dark Mode**: Light and dark theme support
- **Multi-language**: 23 languages supported with auto-detection

### Supported Languages
Chinese (Simplified/Traditional), English, Japanese, Korean, Spanish, Portuguese, French, German, Italian, Dutch, Polish, Czech, Ukrainian, Russian, Turkish, Arabic, Hindi, Bengali, Thai, Vietnamese, Malay, Indonesian

## Demo

**Upload Page**: [https://image.ai6.me/](https://image.ai6.me/)  
**Public Gallery**: [https://image.ai6.me/browse/1/portrait](https://image.ai6.me/browse/1/portrait)

![Login Page](static/readme/login.png)

![Upload Page](static/readme/upload.png)

<details>
<summary>More Screenshots</summary>

![Uploading](static/readme/uploading.png)

![Dashboard](static/readme/dashboard.png)

![Custom Config](static/readme/customer-config.png)

![Status Page](static/readme/status-page.png)

![Public Gallery](static/readme/public-gallery.png)

</details>

## Quick Start

### Cloudflare Pages Deployment

1. Fork this repository
2. Create a new Cloudflare Pages project
3. Connect your forked repository
4. Set build command: `npm install`
5. Deploy

### Docker Deployment

```bash
docker run -d -p 3000:3000 marseventh/cloudflare-imgbed
```

Or with Docker Compose:

```bash
docker-compose up -d
```

## Configuration

All settings can be configured through the Admin Dashboard → System Settings panel after deployment.

### Required Setup
- **KV Database**: Required for storing file metadata
- **Telegram Bot**: Set `TG_BOT_TOKEN` and `TG_CHAT_ID` for Telegram storage

## License

MIT License
