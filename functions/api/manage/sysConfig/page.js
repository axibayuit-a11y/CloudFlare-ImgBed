import { getDatabase } from '../../../utils/databaseAdapter.js';

export async function onRequest(context) {
    // 页面设置相关，GET方法读取设置，POST方法保存设置
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const db = getDatabase(env);

    // GET读取设置
    if (request.method === 'GET') {
        const settings = await getPageConfig(db, env)

        return new Response(JSON.stringify(settings), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }

    // POST保存设置
    if (request.method === 'POST') {
        const body = await request.json()
        const settings = body
        // 写入数据库
        await db.put('manage@sysConfig@page', JSON.stringify(settings))

        return new Response(JSON.stringify(settings), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }

}

export async function getPageConfig(db, env) {
    const settings = {}
    // 读取数据库中的设置
    const settingsStr = await db.get('manage@sysConfig@page')
    const settingsKV = settingsStr ? JSON.parse(settingsStr) : {}

    const config = []
    settings.config = config
    // 使用 i18n key，前端会翻译这些 key
    config.push(
        // 全局设置
        {
            id: 'siteTitle',
            labelKey: 'pageConfig.siteTitle',
            placeholder: 'Sanyue ImgHub',
            categoryKey: 'pageConfig.globalSettings',
        },
        {
            id: 'siteIcon',
            labelKey: 'pageConfig.siteIcon',
            categoryKey: 'pageConfig.globalSettings',
        },
        {
            id: 'ownerName',
            labelKey: 'pageConfig.ownerName',
            placeholder: 'Sanyue ImgHub',
            categoryKey: 'pageConfig.globalSettings',
        },
        {
            id: 'logoUrl',
            labelKey: 'pageConfig.logoUrl',
            categoryKey: 'pageConfig.globalSettings',
        },
        {
            id: 'logoLink',
            labelKey: 'pageConfig.logoLink',
            placeholder: 'https://github.com/axibayuit-a11y',
            tooltipKey: 'pageConfig.logoLinkTip',
            categoryKey: 'pageConfig.globalSettings',
        },
        {
            id: 'bkInterval',
            labelKey: 'pageConfig.bkInterval',
            placeholder: '3000',
            tooltipKey: 'pageConfig.bkIntervalTip',
            categoryKey: 'pageConfig.globalSettings',
        },
        {
            id: 'bkOpacity',
            labelKey: 'pageConfig.bkOpacity',
            placeholder: '1',
            tooltipKey: 'pageConfig.bkOpacityTip',
            categoryKey: 'pageConfig.globalSettings',
        },
        {
            id: 'urlPrefix',
            labelKey: 'pageConfig.urlPrefix',
            tooltipKey: 'pageConfig.urlPrefixTip',
            categoryKey: 'pageConfig.globalSettings',
        },
        // 客户端设置
        {
            id: 'announcement',
            labelKey: 'pageConfig.announcement',
            tooltipKey: 'pageConfig.announcementTip',
            categoryKey: 'pageConfig.clientSettings',
        },
        {
            id: 'defaultUploadChannel',
            labelKey: 'pageConfig.defaultUploadChannel',
            type: 'select',
            options: [
                { label: 'Telegram', value: 'telegram' },
                { label: 'Cloudflare R2', value: 'cfr2' },
                { label: 'S3', value: 's3' },
                { label: 'Discord', value: 'discord' },
                { label: 'HuggingFace', value: 'huggingface' },
            ],
            placeholder: 'telegram',
            categoryKey: 'pageConfig.clientSettings',
        },
        {
            id: 'defaultUploadFolder',
            labelKey: 'pageConfig.defaultUploadFolder',
            placeholderKey: 'pageConfig.defaultUploadFolderPlaceholder',
            categoryKey: 'pageConfig.clientSettings',
        },
        {
            id: 'defaultUploadNameType',
            labelKey: 'pageConfig.defaultUploadNameType',
            type: 'select',
            optionsKey: 'pageConfig.namingOptions',
            placeholder: 'default',
            categoryKey: 'pageConfig.clientSettings',
        },
        {
            id: 'loginBkImg',
            labelKey: 'pageConfig.loginBkImg',
            tooltipKey: 'pageConfig.bkImgTip',
            categoryKey: 'pageConfig.clientSettings',
        },
        {
            id: 'uploadBkImg',
            labelKey: 'pageConfig.uploadBkImg',
            tooltipKey: 'pageConfig.bkImgTip',
            categoryKey: 'pageConfig.clientSettings',
        },
        {
            id: 'footerLink',
            labelKey: 'pageConfig.footerLink',
            categoryKey: 'pageConfig.clientSettings',
        },
        {
            id: 'disableFooter',
            labelKey: 'pageConfig.disableFooter',
            type: 'boolean',
            default: false,
            categoryKey: 'pageConfig.clientSettings',
        },
        // 管理端设置
        {
            id: 'adminLoginBkImg',
            labelKey: 'pageConfig.adminLoginBkImg',
            tooltipKey: 'pageConfig.bkImgTip',
            categoryKey: 'pageConfig.adminSettings',
        }
    )

    const userConfig = env.USER_CONFIG
    if (userConfig) {
        try {
            const parsedConfig = JSON.parse(userConfig)
            if (typeof parsedConfig === 'object' && parsedConfig !== null) {
                // 搜索config中的id，如果存在则更新
                for (let i = 0; i < config.length; i++) {
                    if (parsedConfig[config[i].id]) {
                        config[i].value = parsedConfig[config[i].id]
                    }
                }
            }
        } catch (error) {
            // do nothing
        }
    }

    // 用KV中的设置覆盖默认设置
    for (let i = 0; i < settingsKV.config?.length; i++) {
        const item = settingsKV.config[i]
        const index = config.findIndex(x => x.id === item.id)
        if (index !== -1) {
            config[index].value = item.value
        }
    }

    return settings
}