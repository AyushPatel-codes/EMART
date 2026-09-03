package com.Project.EMART.dto;

public class CategoryRequest {

    private String slug;
    private String label;
    private String icon;
    private String color;

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}