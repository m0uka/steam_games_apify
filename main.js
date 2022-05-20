import Apify from 'apify'

Apify.main(async () => {
    let { onlyOnSale, onlyReleased } = await Apify.getInput()

    const requestQueue = await Apify.openRequestQueue()
    await requestQueue.addRequest({
        url: 'https://store.steampowered.com/',
        userData: {
            label: 'START'
        }
    })

    const crawler = new Apify.CheerioCrawler({
        requestQueue,

        useSessionPool: true,
        maxConcurrency: 50,

        preNavigationHooks: [
            async (_crawlingContext, requestAsBrowserOptions) => {
                requestAsBrowserOptions.headers = {
                    // We need to set this to prevent the age check page
                    "Cookie": "birthtime=0; path=/; max-age=315360000"
                }
            }
        ],
        handlePageFunction: async ({ $, request }) => {
            if (request.userData.label === 'START') {

                await Apify.utils.enqueueLinks({
                    $,
                    requestQueue,
                    selector: 'a[href*="/app/"]',
                    baseUrl: new URL(request.url).origin,
                })

            } else {

                // General

                let gameAreaPurchaseEl = $('div[id^=game_area_purchase_section_add_to_cart]').first()
                if (!gameAreaPurchaseEl || gameAreaPurchaseEl.text().trim() === '') {
                    gameAreaPurchaseEl = $('.game_area_purchase_game').first()
                }

                const glanceEl = $('.glance_ctn_responsive_left').first()

                const title = $('#appHubAppName').text().trim()
                if (title === "") {
                    // ignore store pages that are not games
                    return
                }

                const description = $('.game_description_snippet').text().trim()
                const headerImage = $('.game_header_image_full')?.attr()?.src
                const releaseDate = $('.release_date').find('.date').text()

                const recentReviews = $('.game_review_summary').first().text()
                const allReviews = $('.game_review_summary').last().text()

                const developers = $('#developers_list a').toArray().map((x) => $(x).text())
                const publishers = glanceEl.find('.dev_row').last().find(".summary a").toArray().map((x) => $(x).text())

                const comingSoon = $('.game_area_comingsoon').first().text().trim() != ""
                const earlyAccess = $('#earlyAccessHeader').text().trim() !== ''

                const platformsEl = $('.game_area_purchase_platform')
                const spansEl = platformsEl.find('span')

                // Genres

                const genresEl = $('#genresAndManufacturer span').first().find('a')
                let genres = []
                for (let genre of genresEl) {
                    genres.push($(genre).text())
                }

                // Languages

                let languages = {}

                const languageTable = $('#languageTable table tr')

                for (const row of languageTable) {
                    const r = $(row)
                    if (r.find('th').text() != '') continue
                    if (r.hasClass("unsupported")) continue

                    const languageName = r.find('td').first().text().trim()
                    const langSupport = {
                        interface: ($(r.find('td').get(1)).text().trim()) === '✔',
                        sound: ($(r.find('td').get(2)).text().trim()) === '✔',
                        subtitles: ($(r.find('td').get(3)).text().trim()) === '✔',
                    }

                    languages[languageName] = langSupport
                }

                // Features

                const featuresEl = $('.game_area_features_list_ctn a')

                let features = []
                for (let feature of featuresEl) {
                    features.push($(feature).text())
                }

                // Popular tags

                let popularTags = []

                for (let tag of $('.popular_tags a')) {
                    popularTags.push($(tag).text().trim())
                }

                // Platforms

                let supportedPlatforms = []
                if (spansEl.is((_, el) => el.attribs.class.includes('win'))) {
                    supportedPlatforms.push('windows')
                }

                if (spansEl.is((_, el) => el.attribs.class.includes('linux'))) {
                    supportedPlatforms.push('linux')
                }

                if (spansEl.is((_, el) => el.attribs.class.includes('mac'))) {
                    supportedPlatforms.push('mac')
                }

                if (spansEl.is((_, el) => el.attribs.class.includes('vr_required'))) {
                    supportedPlatforms.push('vr_required')
                }

                // DLC

                let isDLC
                let baseDLCGame
                if (features.includes('DLC') || features.includes('Downloadable Content')) {
                    isDLC = true
                    baseDLCGame = $('#gameHeaderImageCtn').parent().find('.glance_details p a').attr('href')
                }

                // Price

                let price = gameAreaPurchaseEl.find('.game_purchase_price').text().trim()
                let sale = false
                let salePercentage = null
                let saleUntil = null

                if (price === '') {
                    sale = true
                    salePercentage = gameAreaPurchaseEl.find('.discount_pct').text().trim()
                    saleUntil = gameAreaPurchaseEl.find('.game_purchase_discount_countdown').text().trim()

                    price = gameAreaPurchaseEl.find('.discount_final_price').text().trim()
                }


                if (onlyOnSale && !sale) return
                if (onlyReleased && comingSoon) return

                await Apify.pushData({
                    url: request.url,
                    title,
                    description,
                    headerImage,

                    releaseDate,
                    comingSoon,
                    earlyAccess,

                    supportedPlatforms,
                    features,
                    genres,
                    popularTags,
                    languages,

                    price,

                    sale,
                    salePercentage,
                    saleUntil,

                    recentReviews,
                    allReviews,

                    isDLC,
                    baseDLCGame,

                    developers,
                    publishers
                })
            }
        },
    })

    await crawler.run()
})