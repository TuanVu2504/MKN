'use strict';

/**
 * network-device router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::network-device.network-device');
