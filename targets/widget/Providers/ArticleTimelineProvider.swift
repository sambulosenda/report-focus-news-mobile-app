import WidgetKit
import SwiftUI

struct ArticleTimelineProvider: TimelineProvider {
    typealias Entry = ArticleEntry

    private let appGroupID = "group.com.sambulosenda.reportfocusnews.widget"
    private let cacheKey = "cachedArticles"

    // Placeholder for widget gallery
    func placeholder(in context: Context) -> ArticleEntry {
        ArticleEntry(
            date: Date(),
            articles: [
                WidgetArticle(
                    id: "1",
                    databaseId: 1,
                    title: "Breaking News Headline",
                    categoryName: "Politics",
                    imageUrl: nil,
                    date: Date()
                ),
                WidgetArticle(
                    id: "2",
                    databaseId: 2,
                    title: "Latest Updates Today",
                    categoryName: "World",
                    imageUrl: nil,
                    date: Date()
                )
            ]
        )
    }

    // Preview in widget gallery
    func getSnapshot(in context: Context, completion: @escaping (ArticleEntry) -> Void) {
        Task {
            do {
                let count = context.family == .systemSmall ? 2 : 4
                let articles = try await GraphQLService.shared.fetchLatestArticles(count: count)
                completion(ArticleEntry(date: Date(), articles: articles))
            } catch {
                completion(placeholder(in: context))
            }
        }
    }

    // Actual timeline generation
    func getTimeline(in context: Context, completion: @escaping (Timeline<ArticleEntry>) -> Void) {
        let articleCount = context.family == .systemSmall ? 2 : 4

        Task {
            do {
                let articles = try await GraphQLService.shared.fetchLatestArticles(count: articleCount)
                cacheArticles(articles)

                let entry = ArticleEntry(date: Date(), articles: articles)

                // Refresh every 30 minutes
                let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
                let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
                completion(timeline)

            } catch {
                let cachedArticles = getCachedArticles()
                let entry = ArticleEntry(
                    date: Date(),
                    articles: cachedArticles.isEmpty ? placeholder(in: context).articles : cachedArticles
                )

                // Retry in 5 minutes on error
                let nextUpdate = Calendar.current.date(byAdding: .minute, value: 5, to: Date())!
                let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
                completion(timeline)
            }
        }
    }

    private func cacheArticles(_ articles: [WidgetArticle]) {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let data = try? JSONEncoder().encode(articles) else { return }
        defaults.set(data, forKey: cacheKey)
    }

    private func getCachedArticles() -> [WidgetArticle] {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let data = defaults.data(forKey: cacheKey),
              let articles = try? JSONDecoder().decode([WidgetArticle].self, from: data) else {
            return []
        }
        return articles
    }
}
