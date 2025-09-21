export interface IConfiguration {
    background?: IBackgroundConfig;
    gap?: number;
    cols?: number;
}
export interface IBackgroundConfig {
    show?: 'always' | 'whenDragging' | 'none';
    borderColor?: string;
    borderWidth?: number;
    columnColor?: string;
    gapColor?: string;
    rowColor?: string;
}

//-------------------------------------
export class Configuration implements IConfiguration {
    background = new BackgroundConfig();
    gap = 5;
    cols = 12;
}


export class BackgroundConfig implements IBackgroundConfig {
    show: 'always' | 'whenDragging' | 'none' = 'always';
    borderColor: string = '#00b2ff3d';
    borderWidth: number = 1;
    columnColor: string = '#80808017';
    gapColor: string = '#187bf900';
    rowColor: string = '#80808024';
}