"""
  Implementation of the "differential_loading_merge" rule. The implementation runs the
  packager executable in order to group all specified files into the given sections.
"""

def _differential_loading_merge(ctx):
    # Directory that will contain all grouped input files. This directory will be created
    # relatively to the current target package. (e.g. "bin/src/showcase/bundle-es2015.min")
    output_dir = ctx.attr.name

    # Arguments that will be passed to the packager executable.
    args = ctx.actions.args()

    expected_outputs = [ctx.actions.declare_directory(ctx.label.name)]

    args.use_param_file(param_file_arg = "--param-file=%s")
    args.add_all([expected_outputs[0].path])
    args.add_all([s.path for s in ctx.files.srcs])

    # Run the packager executable that groups the specified source files and writes them
    # to the given output directory.
    ctx.actions.run(
        inputs = ctx.files.srcs,
        executable = ctx.executable._packager,
        outputs = expected_outputs,
        arguments = [args],
        progress_message = "DifferentialLoadingMerge",
    )

    return [
        DefaultInfo(files = depset(expected_outputs))
    ]

"""
  Rule definition for the "differential_loading_merge" rule that can accept arbritary source files
  that will be grouped into specified sections. This is being used to package the docs
  content into a desired folder structure that can be shared with the docs application.
"""
differential_loading_merge = rule(
    implementation = _differential_loading_merge,
    attrs = {
        # This defines the sources for the "differential_loading_merge" rule. Instead of just
        # accepting a list of labels, this rule requires the developer to specify a label
        # keyed dictionary. This allows developers to specify where specific targets
        # should be grouped into. This helpful when publishing the docs content because
        # the docs repository does not about the directory structure of the generated files.
        "srcs": attr.label_list(allow_files = True, allow_empty = False),

        # Executable for this rule that is responsible for packaging the specified
        # targets into the associated sections.
        "_packager": attr.label(
            default = Label("//tools/differential-loading-merge"),
            executable = True,
            cfg = "host",
        ),
    },
)
