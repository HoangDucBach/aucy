export type TOrder = 'asc' | 'desc';

export type TAdditionQuery = {
    order?: TOrder;
    limit?: number;
}

export type TQuery = TAdditionQuery & {
    [key: string]: any;
}