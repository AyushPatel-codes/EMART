package com.Project.EMART.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
public class Category {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;   // e.g. "jewelry" — used in URLs, must be unique

    private String label;  // e.g. "Jewelry"
    private String icon;   // e.g. "💍"
    private String color;  // e.g. "#e6007a"

    public Category() {
    }

    public Category(String slug, String label, String icon, String color) {
        this.slug = slug;
        this.label = label;
        this.icon = icon;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}