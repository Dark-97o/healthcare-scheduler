# Antigravity Embedded Skills

Below is the list of active server-side tools (skills) deeply integrated into your current codebase session. These are currently driven by my available **MCP (Model Context Protocol) Servers**.

## Stitch (Active MCP Server)
Stitch is an internal AI-powered UI design platform. I have comprehensive programmatic access to its features, enabling me to rapidly prototype, generate, or adapt complete UI screens before converting them manually to your Vite codebase.

**Available Stitch Tools:**
- `create_project`: Establish a new Stitch design environment.
- `generate_screen_from_text`: Produce complete layout structures from your natural language requests.
- `edit_screens`: Target and natively modify existing UI components.
- `generate_variants`: Instruct the underlying model to brainstorm design variations (different aesthetics, flows, etc.).
- `create_design_system` & `apply_design_system`: Define foundational design tokens (Color Palette, Tailwind presets, Typography, Corners) and apply them programmatically to a block of screens.

### How to direct me to use Stitch:
Currently, the easiest way to utilize these skills is to ask me to *"Design a prototype of an Admin Dashboard in Stitch first, then import the code logic to my React app"*. I will orchestrate the generation step on Google's cloud UI backend, then write the translated Tailwind blocks into your codebase!

## Native Workspace Skills
*No additional custom codebase workflows or `.agents/skills` scripts were found dynamically mounted in your project directory at this time. Should you need any other custom design integrations, let me know, and I will write a custom skill runner for you!*
