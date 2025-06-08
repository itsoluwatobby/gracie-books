/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { InitBookForm } from '../../utils/initVariables';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookServices } from '../../schema';

type AddorEditProps = {
  editBook: Book | null;
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditBook: React.Dispatch<React.SetStateAction<Book | null>>;
}

export default function AddorEdit(
  {
    editBook, setShowBookModal,
    setEditBook,
  }: AddorEditProps
) {
  const [bookForm, setBookForm] = useState<Partial<Book>>(InitBookForm);

  const handleBookFormSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const book = await bookServices.addBook(bookForm);
      console.log(book);
      setEditBook(null);
      setBookForm(InitBookForm);

      toast.success(`${book.title} uploaded`);
      // setShowBookModal(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {editBook ? 'Edit Book' : 'Add New Book'}
              </h2>

              {
                editBook ? null
                :
                <button 
                  // onClick={() => setShowBookModal(false)}
                  className="text-gray-700 border focus:border-blue-500 text-sm border-gray-500 px-2.5 rounded-md p-1.5 hover:text-gray-700"
                >
                  Upload CSV
                </button>

              }
            </div>
            <button 
              onClick={() => setShowBookModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleBookFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                required
              />
              <Input
                label="Author"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                required
              />
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <Input
                label="Price"
                type="number"
                step="0.01"
                value={bookForm.price}
                onChange={(e) => setBookForm({ ...bookForm, price: parseFloat(e.target.value) })}
                required
              />
              <Input
                label="Cover Image URL"
                value={bookForm.coverImage}
                onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                required
              />
              <Input
                label="ISBN"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                required
              />
              <Input
                label="Publisher"
                value={bookForm.publisher}
                onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                required
              />
              <Input
                label="Publication Date"
                type="date"
                value={bookForm.publicationDate}
                onChange={(e) => setBookForm({ ...bookForm, publicationDate: e.target.value })}
                required
              />
              <Input
                label="Page Count"
                type="number"
                value={bookForm.pageCount}
                onChange={(e) => setBookForm({ ...bookForm, pageCount: parseInt(e.target.value) })}
                required
              />
              <Input
                label="Stock Quantity"
                type="number"
                value={bookForm.stockQuantity}
                onChange={(e) => setBookForm({ ...bookForm, stockQuantity: parseInt(e.target.value) })}
                required
              />
              <Input
                label="Rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={bookForm.rating}
                onChange={(e) => setBookForm({ ...bookForm, rating: parseFloat(e.target.value) })}
                required
              />
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Genres (comma-separated)</label>
                <input
                  type="text"
                  value={bookForm.genre?.join(', ')}
                  onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value.split(',').map(g => g.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowBookModal(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">
                {editBook ? 'Save Changes' : 'Add Book'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}