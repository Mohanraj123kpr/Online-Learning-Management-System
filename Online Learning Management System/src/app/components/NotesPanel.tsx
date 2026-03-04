import { useState } from 'react';
import { Note } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { StickyNote, Plus, Trash2 } from 'lucide-react';

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export function NotesPanel({ notes, onAddNote, onDeleteNote }: NotesPanelProps) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleSubmitNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteContent);
      setNewNoteContent('');
      setShowNoteForm(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="size-5" />
            My Notes
          </CardTitle>
          {!showNoteForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNoteForm(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Note Form */}
        {showNoteForm && (
          <div className="space-y-3 rounded-lg border p-3">
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note here..."
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowNoteForm(false);
                  setNewNoteContent('');
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitNote}
                disabled={!newNoteContent.trim()}
              >
                Save Note
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <StickyNote className="mx-auto mb-2 size-8 text-gray-400" />
              <p className="text-sm text-gray-600">No notes yet</p>
              <p className="text-xs text-gray-500">
                Take notes to remember key points
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group rounded-lg border p-3 transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    {formatTime(note.timestamp)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    onClick={() => onDeleteNote(note.id)}
                  >
                    <Trash2 className="size-3 text-red-600" />
                  </Button>
                </div>
                <p className="text-sm text-gray-700">{note.content}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
