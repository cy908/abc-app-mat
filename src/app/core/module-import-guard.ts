// https://angular.io/guide/styleguide#style-04-12
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
    if (parentModule) {
        throw new Error(`${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`);
    }
}