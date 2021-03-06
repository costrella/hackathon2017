(function() {
    'use strict';

    angular
        .module('spPortalApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('family', {
            parent: 'entity',
            url: '/family?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Families'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/family/families.html',
                    controller: 'FamilyController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }]
            }
        })
        .state('family-detail', {
            parent: 'entity',
            url: '/family/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Family'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/family/family-detail.html',
                    controller: 'FamilyDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Family', function($stateParams, Family) {
                    return Family.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'family',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('family-detail.edit', {
            parent: 'family-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/family/family-dialog.html',
                    controller: 'FamilyDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Family', function(Family) {
                            return Family.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('family.new', {
            parent: 'family',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/family/family-dialog.html',
                    controller: 'FamilyDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                surname: null,
                                address: null,
                                lat: null,
                                lng: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('family', null, { reload: 'family' });
                }, function() {
                    $state.go('family');
                });
            }]
        })
        .state('family.edit', {
            parent: 'family',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/family/family-dialog.html',
                    controller: 'FamilyDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Family', function(Family) {
                            return Family.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('family', null, { reload: 'family' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('family.delete', {
            parent: 'family',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/family/family-delete-dialog.html',
                    controller: 'FamilyDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Family', function(Family) {
                            return Family.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('family', null, { reload: 'family' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
