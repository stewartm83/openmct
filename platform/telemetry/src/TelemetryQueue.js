/*****************************************************************************
 * Open MCT Web, Copyright (c) 2014-2015, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT Web is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT Web includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
/*global define*/

define(
    [],
    function () {
        "use strict";

        /**
         * Supports TelemetrySubscription. Provides a simple data structure
         * (with a pool-like interface) that aggregates key-value pairs into
         * a queued series of large objects, ensuring that no value is
         * overwritten (but consolidated non-overlapping keys into single
         * objects.)
         * @constructor
         */
        function TelemetryQueue() {
            var queue = [];

            // Look up an object in the queue that does not have a value
            // assigned to this key (or, add a new one)
            function getFreeObject(key) {
                var index = 0, object;

                // Look for an existing queue position where we can store
                // a value to this key without overwriting an existing value.
                for (index = 0; index < queue.length; index += 1) {
                    if (queue[index][key] === undefined) {
                        return queue[index];
                    }
                }

                // If we made it through the loop, values have been assigned
                // to that key in all queued containers, so we need to queue
                // up a new  container for key-value pairs.
                object = {};
                queue.push(object);
                return object;
            }

            return {
                /**
                 * Check if any value groups remain in this pool.
                 * @return {boolean} true if value groups remain
                 */
                isEmpty: function () {
                    return queue.length < 1;
                },
                /**
                 * Retrieve the next value group from this pool.
                 * This gives an object containing key-value pairs,
                 * where keys and values correspond to the arguments
                 * given to previous put functions.
                 * @return {object} key-value pairs
                 */
                poll: function () {
                    return queue.shift();
                },
                /**
                 * Put a key-value pair into the pool.
                 * @param {string} key the key to store the value under
                 * @param {*} value the value to store
                 */
                put: function (key, value) {
                    getFreeObject(key)[key] = value;
                }
            };
        }

        return TelemetryQueue;
    }
);