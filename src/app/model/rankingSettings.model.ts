export class RankingSettings {

    constructor(public ranking_settings_id?: number,
                public ranking_start_total?: number,
                public one_penalty?: number,
                public two_penalty?: number,
                public three_penalty?: number,
                public four_penalty?: number,
                public ranking_start_date?: number,
                public ranking_end_date?: number,
                public last_updated?: number,) {}
}