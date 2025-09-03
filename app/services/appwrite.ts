import { Client, Databases, ID, Query, RealtimeResponseEvent } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const COLLECTION_ID2 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID2!;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_ID!)

const database = new Databases(client);

type BookmarkSubscriber = (bookmarks: any[]) => void;
const bookmarkSubscribers: Set<BookmarkSubscriber> = new Set();

// Subscribe to bookmark updates
client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID2}.documents`, (response: RealtimeResponseEvent<any>) => {
    // Fetch latest bookmarks and notify subscribers
    getBookmarks().then(result => {
        const bookmarks = result.documents || [];
        bookmarkSubscribers.forEach(subscriber => subscriber(bookmarks));
    });
});

export const subscribeToBookmarks = (callback: BookmarkSubscriber) => {
    bookmarkSubscribers.add(callback);
    // Return unsubscribe function
    return () => {
        bookmarkSubscribers.delete(callback);
    };
};

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
 
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])

        if(result.documents.length > 0){
            const existingMovie = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1
                }
            )
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                poster_url: 'https://image.tmdb.org/t/p/w500' + movie.poster_path,
                title: movie.title
            })
        } 
    } catch (error) {
            console.log(error);
            throw error;
        }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
         const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ])

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error);
        return undefined;
    }
}


export const addBookmark = async (movie: Movie) => {
    try {
        console.log('Adding bookmark for movie:', movie.id);
        const result = await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID2,
            ID.unique(),
            {
                movie_id: movie.id,
                title: movie.title,
                poster_url: 'https://image.tmdb.org/t/p/w500' + movie.poster_path,
                overview: movie.overview,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                vote_count: movie.vote_count,                
            }
        );
        console.log('Bookmark added successfully:', result);
        return result;
    } catch (error) {
        console.error('Error adding bookmark:', error);
        throw error;
    }
};

export const removeBookmark = async (documentId) => {
    await database.deleteDocument(DATABASE_ID, COLLECTION_ID2, documentId);
};

export const getBookmarks = async () => {
    return await database.listDocuments(DATABASE_ID, COLLECTION_ID2);
};