import SwiftUI
import WidgetKit

struct MediumWidgetView: View {
    let entry: ArticleEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                Image(systemName: "newspaper.fill")
                    .font(.subheadline)
                    .foregroundColor(.blue)
                Text("Report Focus")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.secondary)
                Spacer()
                Text("Updated \(entry.date, style: .relative)")
                    .font(.system(size: 9))
                    .foregroundStyle(.tertiary)
            }

            Divider()

            // Two-column layout
            HStack(alignment: .top, spacing: 12) {
                // Left column
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(Array(entry.articles.prefix(2).enumerated()), id: \.element.id) { _, article in
                        ArticleRowView(article: article)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                // Right column
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(Array(entry.articles.dropFirst(2).prefix(2).enumerated()), id: \.element.id) { _, article in
                        ArticleRowView(article: article)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding()
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct ArticleRowView: View {
    let article: WidgetArticle

    var body: some View {
        Link(destination: article.deepLinkUrl) {
            VStack(alignment: .leading, spacing: 2) {
                Text(article.categoryName.uppercased())
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(.blue)

                Text(article.title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.primary)
                    .lineLimit(3)
            }
        }
    }
}
