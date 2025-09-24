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
    private readonly id: number
    private readonly title: string
    private readonly year?: number
    private readonly rating?: number
    private readonly genres?: string[] 
    private readonly companies?: string[]
    private readonly platforms?: string[]

    //Constructor
    constructor(data: ApiGame){
        this.id = data.id
        this.title = data.name
        this.year = data.first_release_date ?  this.getYearFromSeconds(data.first_release_date) : undefined
        this.rating = data.rating ? this.formatRating(data.rating) : undefined
        this.genres = this.createGenresList(data.genres ?? [])
        this.companies = this.createCompaniesList(data.involved_companies ?? [])
        this.platforms = this.createPlatformsList(data.platforms ?? [])
    }

    //Methods
    private formatRating(rating: number): number{
        let formattedRating = Math.round(rating * 10) / 10
        return formattedRating
    }
    private createGenresList(genres: ApiGenre[]): string[]{
        let listOfGenres: string[] = genres.map(item =>{
            return item.name
        })
        return listOfGenres
    }
    private createCompaniesList(companies: ApiCompany[]): string[]{
        let listOfCompanies: string[] = companies.map(item =>{
            return item.company.name
        })
        return listOfCompanies
    }
    private createPlatformsList(platforms: ApiPlatform[]): string[]{
        let listOfPlatforms: string[] = platforms.map(item =>{
            return item.name
        })
        return listOfPlatforms
    }
    private getYearFromSeconds(dateInSeconds: number): number{
        const year =  new Date(dateInSeconds * 1000).getFullYear()
        return year
    }

    //Getters
    public getId(): string{
        return this.id.toString()
    }
    public getTitle(): string{
        return this.title
    }
    public getYear(): string{
        return this.year ? this.year.toString() : "Not Available"
    }
    public getRating(): string{
        return this.rating ? this.rating.toString() : "Not Available"
    }
    public getGenres(): string[] | string{
        if(this.genres && this.genres.length > 0){
            return this.genres
        }else{
            return "Not Available"
        }
    }
    public getCompanies(): string[] | string{
        if(this.companies && this.companies.length > 0){
            return this.companies
        }else{
            return "Not Available"
        }
    }
    public getPlatforms(): string[] | string{
        if(this.platforms && this.platforms.length > 0){
            return this.platforms
        }else{
            return "Not Available"
        }
    }
}

export default Game