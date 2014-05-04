//Oh no global pollution, its necessary
var infoCD = {
    //Character Main Info keys and visual values
    characterInfoList: ['id', 'name', 'level', 'paragonLevel', 'gender', 'class'],
    characterInfoListValue: ['ID', 'Name', 'Level', 'ParagonLevel', 'Gender', 'Class'],
    //Character Items keys and visual values
    itemsList: ['mainHand', 'offHand', 'head', 'torso', 'feet', 'hands', 'shoulders', 'legs', 'bracers', 'waist', 'rightFinger', 'leftFinger', 'neck'],
    itemsValue: ['Main Weapon', 'Offhand', 'Head', 'Torso', 'Feet', 'Gloves', 'Shoulders', 'Legs', 'Bracers', 'Waist', 'Right Finger', 'Left Finger', 'Amulet']
};

app.controller('diabloCtrl', function ($scope, $sce){

    $scope.selectedChar = 0;

    $scope.showChar = function(id, $e){
        $e.preventDefault();
        $scope.selectedChar = id;
    };

    $scope.displayDiv = function(id){
        return (id===$scope.selectedChar);
    };

    $scope.returnCD = function(cd){
        return infoCD[cd];
    };

    //Below two methods are quick hacks to bypass non-secure html
    $scope.showItemInfo = function(item, img){
        if(img){
            return $sce.trustAsHtml('<img src="' + img + '" alt="Item Img" />');
        }else{
            return $sce.trustAsHtml('None');
        }
    };

    $scope.showItemAttr = function(attrStr){
        if(attrStr){
            return $sce.trustAsHtml(attrStr);
        }else{
            return $sce.trustAsHtml('');
        }
    };

    $scope.getItemFullName = function(index){
        return infoCD.itemsValue[index];
    };

    //Data loaded?
    $scope.diabloLoaded = function(){
        if($scope.heroObjArray.length>0){
            return ($scope.heroObjArray.length===$scope.itemCompleted);
        }else{
            return false;
        }
    };

});



//Called when main character sheet is received with character's ids
app.factory('diabloPush', function ($q, diabloCalls, updateHeroObj) {
    return{
        getHeroFromId: function (idArray, acctName, $scope) {
            var queueCalls = [];
            angular.forEach(idArray, function (id, i) {
                queueCalls.push(diabloCalls.getCharacterDetails(acctName, id));
            });
            $q.all(queueCalls).then(function (data, i) {
                var heroDataArray = [];
                angular.forEach(data, function (hero, i) {
                    heroDataArray.push(hero.data);
                });
                //For each of the hero obj in an array call the below factory service
                angular.forEach(heroDataArray, function (eachHero) {
                    updateHeroObj.updateHeroObj($scope, eachHero);
                });

            })
        }
    }
});

//Called after each character is finished
app.factory('updateHeroObj', function (HeroClass, diabloCalls, $q) {
    return{
        updateHeroObj: function ($scope, heroInfo) {

            var currentHero = new HeroClass.HeroCon();
            $scope.heroObjArray.push(currentHero);
            //Update hero stats
            angular.forEach(infoCD.characterInfoList, function (key) {
                currentHero.updateCharacterInfo(key, heroInfo[key]);
            });
            //Update dmg individually
            currentHero.updateCharacterInfo('damage', heroInfo.stats.damage);
            //Update hero items
            angular.forEach(infoCD.itemsList, function (key) {
                currentHero.updateItemInfo(key, heroInfo.items[key]);
            });
            //Get each item info
            var itemsQueue = [];
            angular.forEach(infoCD.itemsList, function (item) {
                var itemNum = currentHero.returnItemParm(item);
                if (itemNum) {
                    itemsQueue.push(diabloCalls.getItemDetails(itemNum, item));
                }
            });
            $q.all(itemsQueue).then(function(res){
                $scope.itemCompleted++;
                angular.forEach(res, function(item, i){
                    currentHero.updateItemDesc(item[1], item[0].data);
                })
            })

        }
    }
});

//Individual http calls you make
app.factory('diabloCalls', function ($http, $q) {
    return {
        getAcctDetails: function (accountName) {
            return $http.jsonp('http://us.battle.net/api/d3/profile/' + accountName + '/?&callback=JSON_CALLBACK').then(function (response) {
                return response;
            }, function (response) {
                return $q.reject(response);
            });
        },
        getCharacterDetails: function (acctName, charId) {
            return $http.jsonp('http://us.battle.net/api/d3/profile/' + acctName + '/hero/' + charId + '?&callback=JSON_CALLBACK').then(function (response) {
                return response;
            }, function (response) {
                return $q.reject(response);
            });
        },
        getItemDetails: function (item, slot) {
            return $http.jsonp('http://us.battle.net/api/d3/data/' + item + '?&callback=JSON_CALLBACK').then(function (response) {
                return [response, slot];
            }, function (response) {
                return $q.reject(response);
            });
        }

    };
});

app.factory('HeroClass', function () {
    return {
        HeroCon: function () {
            //Populate all the private variables - not necessary but make code easier to understand
            //PRIVATE Basics of character, populated in the 2nd ajax iteration
            var characterInfo = {
                id: 0,
                name: '',
                class: '',
                gender: 0,
                level: 0,
                paragonLevel: 0,
                damage: 0
            };
            //PRIVATE itemInfo store items as json objects, can extract more info out of it in the future
            var itemInfo = {
                mainHand: {},
                offHand: {},
                head: {},
                torso: {},
                feet: {},
                hands: {},
                shoulders: {},
                legs: {},
                bracers: {},
                waist: {},
                rightFinger: {},
                leftFinger: {},
                neck: {}
            };
            //PRIVATE itemDesc stores attributes and details of unique items, populated by 3rd ajax iteration
            var itemDesc = {
                mainHand: {},
                offHand: {},
                head: {},
                torso: {},
                feet: {},
                hands: {},
                shoulders: {},
                legs: {},
                bracers: {},
                waist: {},
                rightFinger: {},
                leftFinger: {},
                neck: {}
            };
            //PUBLIC Methods for UPDATE private variables
            this.updateCharacterInfo = function (key, data) {
                characterInfo[key] = data;
            };
            this.updateItemInfo = function (key, data) {
                itemInfo[key] = data;
            };
            this.updateItemDesc = function (key, data) {
                itemDesc[key] = data;
            };
            //PUBLIC Methods for READ
            this.returnCharacterInfo = function (key) {
                return characterInfo[key];
            };
            this.returnCharacterGender = function () {
                if (characterInfo.gender === 0) {
                    return 'Male';
                } else {
                    return 'Female';
                }
            };
            this.returnItemInfo = function (key) {
                return itemInfo[key];
            };
            this.returnItemImage = function (key) {
                //prevent return of undefined variables - some characters don't have offhand, or amor yet
                try {
                    return 'http://media.blizzard.com/d3/icons/items/large/' + itemInfo[key].icon + '.png';
                } catch (e) {
                    return 0;
                }
            };
            this.returnItemParm = function (key) {
                //prevent return of undefined variables - some characters don't have offhand, or amor yet
                try {
                    var itemParm = itemInfo[key].tooltipParams;
                    return itemInfo[key].tooltipParams;
                } catch (e) {
                    return 0;
                }
            };
            this.returnItemDesc = function (key) {
                return itemDesc[key];
            };
            //Returns the attributes of the item. Each unique item has its own rest call
            this.returnItemDescAttributes = function (key) {
                try {
                    var itemDescPrimary = '';
                    var itemDescSecondary = '';
                    //Primary attributes of item = 4?
                    $.each(itemDesc[key].attributes.primary, function (i, data) {
                        itemDescPrimary += (data.text + '<br/>');
                    });
                    //Secondary attributes of item = 2?
                    $.each(itemDesc[key].attributes.secondary, function (i, data) {
                        itemDescSecondary += (data.text + '<br/>');
                    });
                    if (itemDescPrimary || itemDescSecondary) {
                        return itemDescPrimary + '<br/>' + itemDescSecondary;
                    } else {
                        return 0;
                    }
                } catch (e) {
                    return 0;
                }
            };
            //Able to add more PUBLIC methods if needed in the future
        }
    }
});