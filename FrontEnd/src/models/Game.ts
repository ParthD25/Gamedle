interface ApiGenre{
    id: number
    name: string
}

interface ApiCompany{
    id: number
    company: {
        id: number
        name: string
    }
}

interface ApiPlatform{
    id: number
    name: string
}

interface ApiGame{
    id: number
    name: string
    first_release_date?: number
    rating?: number
    genres?: ApiGenre[]
    involved_companies?: ApiCompany[]
    platforms?: ApiPlatform[]
}

class Game{
    //Properties
    public readonly id: number
    public readonly title: string
    public readonly year?: Date
    public readonly rating?: number
    public readonly genres?: string[] 
    public readonly companies?: string[]
    public readonly platforms?: string[]

    //Constructor
    constructor(data: ApiGame){
        this.id = data.id
        this.title = data.name
        this.year = data.first_release_date ?  new Date(data.first_release_date * 1000) : undefined
        this.rating = data.rating
        this.genres = this.getGenres(data.genres ?? [])
        this.companies = this.getCompanies(data.involved_companies ?? [])
        this.platforms = this.getPlatforms(data.platforms ?? [])
    }

    //Methods
    private getGenres(genres: ApiGenre[]): string[]{
        let listOfGenres: string[] = genres.map(item =>{
            return item.name
        })
        return listOfGenres
    }
    private getCompanies(companies: ApiCompany[]): string[]{
        let listOfCompanies: string[] = companies.map(item =>{
            return item.company.name
        })
        return listOfCompanies
    }
    private getPlatforms(platforms: ApiPlatform[]): string[]{
        let listOfPlatforms: string[] = platforms.map(item =>{
            return item.name
        })
        return listOfPlatforms
    }
}

export default Game