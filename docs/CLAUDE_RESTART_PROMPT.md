# Claude Code Session Prompt - Indica AI + Figma MCP

## Project Context
I'm working on the **circle-picks** project located at `/Users/renan/desktop/_dev/circle-picks`

This is a Next.js + TypeScript app for a social recommendations platform called "Friends Places MVP".

## What I Need

I want you to use the Figma MCP server to fetch design specifications from this Figma frame:
**Figma URL**: https://www.figma.com/design/FQpJulGSTWjmA7Ho18WRqG/Untitled?node-id=3-7&t=p4Y01lLyOWVYXfyE-1

## Important Guidelines

1. **Read the context files first** - Located in `/Users/renan/desktop/_dev/circle-picks/context/`:
   - `index.json` - Navigation guide to all context
   - `front.strategy.json` - Product strategy and scope
   - `front.tech.json` - Technical architecture and domain models
   - `front.ux.json` - UX patterns and design tokens
   - `front.setup-plan.json` - Implementation plan

2. **Also read the prompt files**:
   - `PROMPT_1_FEED.md` - Feed/Home screen specs
   - `PROMPT_2_ADD_PLACE.md` - Quick Add flow specs
   - `PROMPT_3_PROFILE.md` - Profile screen specs

3. **Design Approach**:
   - **KEEP** all design guidelines from the context files (colors, spacing, typography, component specs)
   - **USE** Figma ONLY as a visual reference for positioning and component layout
   - Do NOT override the design system from context files with Figma values

4. **Design System to Follow** (from context files):
   - Colors: Primary #111111, Accent #007AFF, Surface #F6F7F9, etc.
   - Typography: Inter font, specific sizes (22px, 19px, 16px, 14px)
   - Spacing: 4px/8px/16px/24px
   - Border Radius: 12px (chips) / 14px (cards)

## What to Implement

Please help me implement the screens based on the Figma visual layout and the context specifications:
1. Feed/Home screen
2. Quick Add flow
3. Profile screen

Use the Figma MCP server to:
- Fetch the frame/node data
- Understand component positioning and layout structure
- Get visual hierarchy information

Then apply changes to the project following the technical architecture defined in the context files.

## Current Project State

The project has:
- Next.js setup with App Router
- Tailwind CSS configured
- Basic folder structure with features/ folders
- Some components already exist (check src/ folder)

Start by using Figma MCP to fetch the design, then let me know what you see and propose an implementation plan.
