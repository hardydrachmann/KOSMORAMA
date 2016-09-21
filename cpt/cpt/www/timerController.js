angular
    .module('starter')
    .controller('TimerCtrl', function($interval) {

        var self = this;
        var counter;

        self.duration = 0;
        self.current = 0;
        self.seconds = 0;
        self.paused = false;

        self.start = function() {
            if (!counter) {
                incrementTimer();
                counter = $interval(function() {
                    incrementTimer();
                }, 1000, self.duration);
            }
        };

        self.reset = function() {
            $interval.cancel(counter);
            counter = null;
            self.current = 0;
            self.seconds = 0;
            self.paused = false;
        };

        self.pause = function() {
            if (counter) {
                if (self.paused) {
                    self.resume();
                    self.paused = false;
                }
                else {
                    $interval.cancel(counter);
                    self.paused = true;
                }
            }
        };

        self.resume = function() {
            counter = $interval(function() {
                incrementTimer();
            }, 1000, self.duration - self.seconds);
        };

        function incrementTimer() {
            if (self.current < self.duration) {
                self.seconds++;
                self.current++;
            }
        }
    });