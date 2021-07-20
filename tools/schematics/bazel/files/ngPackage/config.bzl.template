"""
  Entry points list for <%= shortName %>.
"""

entry_points = [
    # do not sort<% for (let entryPoint of entryPoints) { %>
    "<%= entryPoint %>",<% } %>
]

# List of all non-testing entry-points of the <%= capitalize(shortName) %> package.
<%= uc(shortName) %>_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not "/testing" in ep
]

# List of all testing entry-points of the <%= capitalize(shortName) %> package.
<%= uc(shortName) %>_TESTING_ENTRYPOINTS = [
    ep
    for ep in entry_points
    if not ep in <%= uc(shortName) %>_ENTRYPOINTS
]

# List of all non-testing entry-point targets of the <%= capitalize(shortName) %> package.
<%= uc(shortName) %>_TARGETS = ["//src/<%= name %>"] + \
<%= ' '.repeat(shortName.length + 11) %>["//src/<%= name %>/%s" % ep for ep in <%= uc(shortName) %>_ENTRYPOINTS]

# List of all testing entry-point targets of the <%= capitalize(name) %> package.
<%= uc(shortName) %>_TESTING_TARGETS = ["//src/<%= name %>/%s" % ep for ep in <%= uc(shortName) %>_TESTING_ENTRYPOINTS]

<%= uc(shortName) %>_MARKDOWN_TARGETS = [<% for (let markdownModule of markdownModules) { %>
    "<%= markdownModule %>",<% } %>
]
