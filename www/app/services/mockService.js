angular
    .module('kosmoramaApp')
    .service('mockService', function() {

        var mockballeman = {
            AllowMsgFeedback: true,
            Id: 79,
            Name: "G. Ravballeman",
            UserMessages: [{
                Content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a tellus a nisl tincidunt posuere. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam posuere felis quis sodales pellentesque. Fusce vel placerat ipsum. Nam eu lacus sed justo porttitor aliquet. Quisque at arcu fermentum, dictum purus vel, blandit metus. Duis bibendum porta massa, ut laoreet leo venenatis eget. Vestibulum cursus dapibus lorem eu dignissim. Praesent lacus felis, facilisis lobortis mi vel, porttitor facilisis tellus. Vestibulum fermentum ligula risus, facilisis congue nisi finibus vitae. Ut laoreet eros urna, nec finibus risus vulputate in. Aenean vel fringilla risus. Nam aliquet leo lorem.',
                IsRead: true,
                Time: "2016-09-19T16:58:23.37",
                Title: "Lipsum besked",
            }, {
                Content: 'Mock message content test',
                IsRead: false,
                Time: "2016-09-19T16:58:23.37",
                Title: "Testbesked",
            }]
        };

        var mockTraining = [{
            ExeciseUrl: "https://www.youtube.com/v/csa_VMnnO2U?version=2&rel=0&autohide=1&showinfo=0&theme=light&loop=1&modestbranding=1",
            ExerciseId: "NoKinect_03",
            ExerciseOrderNumber: 0,
            IsTest: false,
            LangDesc: {
                Description: null,
                Id: 312,
                da_DK: "Sid med let spredte ben og ret ryggen hele tiden. Hold bolden i venstre hånd og klem hårdt om bolden alt det du kan, og slap af igen.",
                de_AT: null,
                en_US: "Sit with your feet slightly apart, keeping your back straight. Hold a ball in your left hand, squeeze it as tight as you can and then relax. Repeat as many times as you can.",
                nb_NO: "Sitt med lett spredte ben og rett rygg hele tiden. Hold ballen med venstre hånd og klem den så hardt du kan før du slapper av igjen. Gjenta øvelsen så mange ganger som mulig. ",
                sv_SE: null
            },
            LangName: {
                Description: null,
                Id: 311,
                da_DK: "Knyt hånd om bold – venstre",
                de_AT: null,
                en_US: "Squeezing a ball (left hand)",
                nb_NO: "Klem hand rundt ball - venstre",
                sv_SE: null
            },
            Pause: 0,
            PlanExerciseId: 261221,
            Questions: null,
            Repetitions: 1,
            SessionOrderNumber: 2,
            SetId: 2,
            Sets: 1,
            TimeSet: 1,
            TrainingId: 212436,
            Type: 40
        }, {
            ExeciseUrl: "https://www.youtube.com/v/5U5L7AIYR-4?version=2&rel=0&autohide=1&showinfo=0&theme=light&loop=1&modestbranding=1",
            ExerciseId: "NoKinect_02",
            ExerciseOrderNumber: 1,
            IsTest: false,
            LangDesc: {
                Description: null,
                Id: 310,
                da_DK: "Sid med let spredte ben og ret ryggen hele tiden. Gør din fod kort ved at trække venstre hæl og tæer mod hinanden så du løfter din fodbue op. Hold spændingen lidt og slap af.",
                de_AT: null,
                en_US: "Sit with your feet slightly apart, keeping your back straight. Shorten your left foot by pulling the heel and toes in towards one another, raising the arch of your foot. Hold this position for a moment and then relax. Repeat as many times as you can.",
                nb_NO: "Sitt med lett spredte ben og rett rygg hele tiden. Gjør foten din kort ved å trekke venstre hæl og tær mot hverandre, slik at du løfter fotbuen opp. Hold spenningen litt før du slapper av. Gjenta så mange ganger som mulig. ",
                sv_SE: null,
            },
            LangName: {
                Description: null,
                Id: 309,
                da_DK: "Kortfodsøvelse venstre",
                de_AT: null,
                en_US: "Short foot exercise (left)",
                nb_NO: "Kortfotsøvelse venstre",
                sv_SE: null
            },
            Pause: 0,
            PlanExerciseId: 261222,
            Questions: null,
            Repetitions: 1,
            SessionOrderNumber: 2,
            SetId: 2,
            Sets: 1,
            TimeSet: 1,
            TrainingId: 212436,
            Type: 40,
        }, {
            ExeciseUrl: "https://www.youtube.com/v/grfE6C3hYK8?version=2&rel=0&autohide=1&showinfo=0&theme=light&loop=1&modestbranding=1",
            ExerciseId: "57_hard",
            ExerciseOrderNumber: 2,
            IsTest: false,
            LangDesc: {
                Description: null,
                Id: 248,
                da_DK: "Stå med let spredte ben og ret ryggen hele tiden. Hold hænderne samlet med strakte arme foran dig, og før dem nu op over hovedet så højt du kan uden at svaje i lænden. Før armene helt ned igen.",
                de_AT: null,
                en_US: "Stand with your feet slightly apart, keeping your back straight. Hold your hands together in front of you with your arms straight. Now raise your arms up over your head as high as you can, keeping your lower back straight. Then bring your arms back down again.  ",
                nb_NO: "Stå med lett spredte ben og rett rygg hele tiden. Hold hendene samlet med strake armer foran deg, og før dem så høyt du kan over hodet uten å svaie i ryggen. Før armene ned igjen. ",
                sv_SE: null,
            },
            LangName: {
                Description: null,
                Id: 247,
                da_DK: "Stående pullover, sværhedsgrad 2",
                de_AT: null,
                en_US: "Standing pullover - Level of difficulty 2",
                nb_NO: "Stående pullover, vanskelighetsgrad 2",
                sv_SE: null
            },
            Pause: 0,
            PlanExerciseId: 261223,
            Questions: null,
            Repetitions: 1,
            SessionOrderNumber: 2,
            SetId: 2,
            Sets: 1,
            TimeSet: 1,
            TrainingId: 212436,
            Type: 40
        }];

        this.getUser = function(userScreenNumber, callback) {
            console.log('MOCK: Get user with screen number', userScreenNumber);
            callback(mockballeman);
        };

        this.getTraining = function(UserId, callback) {
            console.log('MOCK: Get training for user with id', UserId);
            callback(mockTraining);
        };

        this.postData = function(trainingReport, callback) {
            console.log('MOCK: Report received by database', trainingReport);
            callback();
        };

        this.postNoteData = function(noteId, callback) {
            console.log('MOCK: Message marked as read by database', noteId);
            callback({});
        };

        this.postFeedback = function(feedbackObject, callback) {
            console.log('MOCK: Training pass feedback received by database', feedbackObject);
            callback();
        };
    });