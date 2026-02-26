package com.example.demo.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BorrowBookDTO {
    private Long bookId;
    private String bookName;
    private Long memberId;
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private Long borrowerId;
}
