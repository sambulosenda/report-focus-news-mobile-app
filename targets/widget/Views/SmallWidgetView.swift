import SwiftUI
import WidgetKit

struct SmallWidgetView: View {
    let entry: ArticleEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                Image(systemName: "newspaper.fill")
                    .font(.caption)
                    .foregroundColor(.blue)
                Text("Report Focus")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.secondary)
                Spacer()
            }

            Spacer()

            // Articles
            ForEach(entry.articles.prefix(2)) { article in
                Link(destination: article.deepLinkUrl) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(article.categoryName.uppercased())
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(.blue)

                        Text(article.title)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.primary)
                            .lineLimit(2)
                    }
                }
            }

            Spacer()
        }
        .padding()
        .containerBackground(.fill.tertiary, for: .widget)
    }
}
