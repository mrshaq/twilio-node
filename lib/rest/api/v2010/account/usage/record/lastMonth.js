'use strict';

var Q = require('q');
var _ = require('lodash');
var InstanceResource = require('../../../../../../base/InstanceResource');
var ListResource = require('../../../../../../base/ListResource');
var Page = require('../../../../../../base/Page');
var values = require('../../../../../../base/values');

var LastMonthPage;
var LastMonthList;
var LastMonthInstance;
var LastMonthContext;

/**
 * Initialize the LastMonthPage
 *
 * :param Version version: Version that contains the resource
 * :param Response response: Response from the API
 * :param accountSid: A 34 character string that uniquely identifies this resource.
 *
 * @returns LastMonthPage
 */
function LastMonthPage(version, response, accountSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    accountSid: accountSid
  };
}

_.extend(LastMonthPage.prototype, Page.prototype);
LastMonthPage.prototype.constructor = LastMonthPage;

/**
 * Build an instance of LastMonthInstance
 *
 * :param dict payload: Payload response from the API
 *
 * @returns LastMonthInstance
 */
LastMonthPage.prototype.getInstance = function getInstance(payload) {
  var version = this._version;
  var solution = this._solution;

  return new LastMonthInstance(
    version,
    payload,
    solution.accountSid
  );
};


/**
 * Initialize the LastMonthList
 *
 * :param Version version: Version that contains the resource
 * :param accountSid: A 34 character string that uniquely identifies this resource.
 *
 * @returns LastMonthList
 */
function LastMonthList(version, accountSid) {
  function LastMonthListInstance(sid) {
    return LastMonthListInstance.get(sid);
  }

  LastMonthListInstance._version = version;
  // Path Solution
  LastMonthListInstance._solution = {
    accountSid: accountSid
  };
  LastMonthListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/Usage/Records/LastMonth.json' // jshint ignore:line
  )(LastMonthListInstance._solution);
  /**
   * Streams LastMonthInstance records from the API.
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * @param {Function} opts.callback -
   *          A callback function to process records
   *         @param {number} [opts.limit] -                   Upper limit for the number of records to return.
   *                            list() guarantees never to return more than limit.
   *                            Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         list() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   */
  LastMonthListInstance.stream = function stream(opts) {
    if (!(opts && 'callback' in opts)) {
      throw new Error('opts.callback parameter required');
    }

    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    var deferred = Q.defer();
    function fetchNextPage(fn) {
      var promise = fn();

      promise.then(function(page) {
        _.each(page.instances, opts.callback);

        if (limits.pageLimit && limits.pageLimit <= currentPage) {
          deferred.resolve()
        } else {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(deferred.reject);
    }

    fetchNextPage(_.bind(this.page, this, opts));

    return deferred.promise;
  };

  /**
   * Lists LastMonthInstance records from the API as a list.
   *
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   *
   * @returns {Array} A list of records
   */
  LastMonthListInstance.list = function list(opts) {
    opts = opts || {};

    var allResources = [];
    opts.callback = function(resource) {
      allResources.push(resource);
    };

    var promise = this.stream(opts);
    promise = promise.then(function() {
      return allResources;
    });

    return promise;
  };

  /**
   * Retrieve a single page of LastMonthInstance records from the API.
   * Request is executed immediately
   *
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   *
   * @returns Page of LastMonthInstance
   */
  LastMonthListInstance.page = function page(opts) {
    opts = opts || {};

    var version = this._version;
    var solution = this._solution;

    opts = opts || {};
    var params = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = version.page(
      'GET',
      this._uri,
      { params: params }
    );

    promise = promise.then(function(response) {
      return new LastMonthPage(
        version,
        response,
        solution.accountSid
      );
    });

    return promise;
  };

  return LastMonthListInstance;
}


/**
 * Initialize the LastMonthContext
 *
 * @param {Version} version - Version that contains the resource
 * @param {object} payload - The instance payload
 *
 * @returns {LastMonthContext}
 */
function LastMonthInstance(version, payload, accountSid) {
  InstanceResource.prototype.constructor.call(this, version);

  // Marshaled Properties
  this._properties = {
    accountSid: payload.account_sid, // jshint ignore:line,
    apiVersion: payload.api_version, // jshint ignore:line,
    category: payload.category, // jshint ignore:line,
    count: payload.count, // jshint ignore:line,
    countUnit: payload.count_unit, // jshint ignore:line,
    description: payload.description, // jshint ignore:line,
    endDate: payload.end_date, // jshint ignore:line,
    price: payload.price, // jshint ignore:line,
    priceUnit: payload.price_unit, // jshint ignore:line,
    startDate: payload.start_date, // jshint ignore:line,
    subresourceUris: payload.subresource_uris, // jshint ignore:line,
    uri: payload.uri, // jshint ignore:line,
    usage: payload.usage, // jshint ignore:line,
    usageUnit: payload.usage_unit, // jshint ignore:line,
  };

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
  };
}

_.extend(LastMonthInstance.prototype, InstanceResource.prototype);
LastMonthInstance.prototype.constructor = LastMonthInstance;

Object.defineProperty(LastMonthInstance.prototype,
  'accountSid', {
  get: function() {
    return this._properties.accountSid;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'apiVersion', {
  get: function() {
    return this._properties.apiVersion;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'category', {
  get: function() {
    return this._properties.category;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'count', {
  get: function() {
    return this._properties.count;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'countUnit', {
  get: function() {
    return this._properties.countUnit;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'description', {
  get: function() {
    return this._properties.description;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'endDate', {
  get: function() {
    return this._properties.endDate;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'price', {
  get: function() {
    return this._properties.price;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'priceUnit', {
  get: function() {
    return this._properties.priceUnit;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'startDate', {
  get: function() {
    return this._properties.startDate;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'subresourceUris', {
  get: function() {
    return this._properties.subresourceUris;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'uri', {
  get: function() {
    return this._properties.uri;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'usage', {
  get: function() {
    return this._properties.usage;
  },
});

Object.defineProperty(LastMonthInstance.prototype,
  'usageUnit', {
  get: function() {
    return this._properties.usageUnit;
  },
});

module.exports = {
  LastMonthPage: LastMonthPage,
  LastMonthList: LastMonthList,
  LastMonthInstance: LastMonthInstance,
  LastMonthContext: LastMonthContext
};