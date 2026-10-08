package com.Project.EMART.util;

import com.Project.EMART.dto.Dtos.PageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import java.util.List;
import java.util.function.Function;
import java.util.regex.Pattern;

public final class PageUtil {
    private PageUtil() {}

    public static Pageable of(int page, int size, Sort sort) {
        return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), sort);
    }

    public static <E, D> PageResponse<D> page(MongoTemplate mongo, Query q, Pageable p, Class<E> type, Function<E, D> mapper) {
        long total = mongo.count(Query.of(q).limit(-1).skip(-1), type);
        List<D> content = mongo.find(Query.of(q).with(p), type).stream().map(mapper).toList();
        return new PageResponse<>(content, p.getPageNumber(), p.getPageSize(), total,
                (int) Math.ceil((double) total / p.getPageSize()));
    }

    /** Case-insensitive literal match (user input is quoted, so no regex injection). */
    public static Pattern regex(String s) {
        return Pattern.compile(Pattern.quote(s.trim()), Pattern.CASE_INSENSITIVE);
    }

    public static double round2(double v) { return Math.round(v * 100.0) / 100.0; }
}
