import Foundation

class GraphQLService {
    static let shared = GraphQLService()
    private let endpoint = URL(string: "https://backend.reportfocusnews.com/graphql")!

    func fetchLatestArticles(count: Int) async throws -> [WidgetArticle] {
        let query = """
        query GetPosts($first: Int!) {
            posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
                nodes {
                    id
                    databaseId
                    title
                    date
                    featuredImage {
                        node {
                            sourceUrl
                        }
                    }
                    categories {
                        nodes {
                            name
                        }
                    }
                }
            }
        }
        """

        let body: [String: Any] = [
            "query": query,
            "variables": ["first": count]
        ]

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(GraphQLResponse.self, from: data)

        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        return response.data.posts.nodes.map { node in
            var parsedDate = Date()
            if let date = dateFormatter.date(from: node.date) {
                parsedDate = date
            } else {
                let fallbackFormatter = ISO8601DateFormatter()
                if let date = fallbackFormatter.date(from: node.date) {
                    parsedDate = date
                }
            }

            return WidgetArticle(
                id: node.id,
                databaseId: node.databaseId,
                title: node.title,
                categoryName: node.categories.nodes.first?.name ?? "News",
                imageUrl: node.featuredImage?.node.sourceUrl,
                date: parsedDate
            )
        }
    }
}

// MARK: - GraphQL Response Types

struct GraphQLResponse: Codable {
    let data: PostsData
}

struct PostsData: Codable {
    let posts: PostsConnection
}

struct PostsConnection: Codable {
    let nodes: [PostNode]
}

struct PostNode: Codable {
    let id: String
    let databaseId: Int
    let title: String
    let date: String
    let featuredImage: FeaturedImageNode?
    let categories: CategoriesConnection
}

struct FeaturedImageNode: Codable {
    let node: ImageNode
}

struct ImageNode: Codable {
    let sourceUrl: String
}

struct CategoriesConnection: Codable {
    let nodes: [CategoryNode]
}

struct CategoryNode: Codable {
    let name: String
}
