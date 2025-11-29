import Foundation
import WidgetKit

struct WidgetArticle: Codable, Identifiable {
    let id: String
    let databaseId: Int
    let title: String
    let categoryName: String
    let imageUrl: String?
    let date: Date

    var deepLinkUrl: URL {
        URL(string: "reportfocus://article/\(databaseId)")!
    }
}

struct ArticleEntry: TimelineEntry {
    let date: Date
    let articles: [WidgetArticle]
}
