import Apify from 'apify'

Apify.main(async () => {
    let { onlyOnSale } = await Apify.getInput()

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
        maxConcurrency: 1000,

        preNavigationHooks: [
            async (crawlingContext, requestAsBrowserOptions) => {
                requestAsBrowserOptions.headers = {
                    // We need to set this to prevent the age check page
                    "Cookie": "birthtime=0; path=/; max-age=315360000"
                }
            }
        ],
        handlePageFunction: async ({ $, request }) => {
            try {

                if (request.userData.label === 'START') {

                    console.log(request)
                    // console.log($('html').text())

                    await Apify.utils.enqueueLinks({
                        $,
                        requestQueue,
                        // The selector is from our earlier code.
                        selector: 'a[href*="/app/"]',
                        // The baseUrl option automatically resolves relative URLs.
                        baseUrl: new URL(request.url).origin,
                    });

                } else {

                    const gameAreaPurchaseEl = $('.game_area_purchase_game_wrapper .game_area_purchase_game').first()
                    const glanceEl = $('.glance_ctn_responsive_left').first()

                    const title = $('#appHubAppName').text().trim()
                    const description = $('.game_description_snippet').text().trim()
                    const headerImage = $('.game_header_image_full').attr().src
                    const releaseDate = $('.release_date').find('.date').text()

                    const recentReviews = $('.game_review_summary').first().text()
                    const allReviews = $('.game_review_summary').last().text()

                    const developer = $('#developers_list a').text()
                    const publisher = glanceEl.find('.dev_row').last().find(".summary a").text().trim()

                    const comingSoon = $('.game_area_comingsoon').find('.content h1 span').text() != ''

                    const platformsEl = $('.game_area_purchase_platform')
                    const spansEl = platformsEl.find('span')

                    const genresEl = $('#genresAndManufacturer').find('span').first().find('a')
                    let genres = []
                    for (let genre of genresEl) {
                        genres.push($(genre).text())
                    }

                    const featuresEl = $('.game_area_features_list_ctn a')

                    let features = []
                    for (let feature of featuresEl) {
                        features.push($(feature).text())
                    }

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

                    await Apify.pushData({
                        title,
                        description,
                        headerImage,

                        releaseDate,
                        comingSoon,

                        supportedPlatforms,
                        features,
                        genres,

                        price,

                        sale,
                        salePercentage,
                        saleUntil,

                        recentReviews,
                        allReviews,

                        developer,
                        publisher
                    })
                }
            }
            catch (err) {
                console.error(err)
            }
        },
    });

    await crawler.run()
})