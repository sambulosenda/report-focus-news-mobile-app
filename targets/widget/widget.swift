import WidgetKit
import SwiftUI

struct ReportFocusWidget: Widget {
    let kind: String = "ReportFocusWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: kind,
            provider: ArticleTimelineProvider()
        ) { entry in
            WidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Report Focus News")
        .description("Stay updated with the latest headlines.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct WidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: ArticleEntry

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

@main
struct ReportFocusWidgetBundle: WidgetBundle {
    var body: some Widget {
        ReportFocusWidget()
    }
}
